using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using Core;
using Core.Models;
using Google.Apis.Auth;
using MainAPI.SecurityDto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Security.Enums;
using Security.IRepositories;
using Security.IServices;
using Security.Models;

namespace MainAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
  private ISecurityService _securityService;
  private IAuthUserService _authUserService;
  private readonly CreateUserDtoValidator _validator;
  private IUserAuthMethodRepository _authMethodRepository;
  private readonly HttpClient _httpClient;

  public AuthController(ISecurityService securityService, IAuthUserService authUserService, CreateUserDtoValidator validator, IUserAuthMethodRepository authMethodRepository, HttpClient httpClient)
  {
    if (Secrets._googleClientId.Equals(""))
    {
      throw new Exception("Remember the constants from the file");
    }
    _securityService = securityService;
    _authUserService = authUserService;
    _validator = validator;
    _authMethodRepository = authMethodRepository;
    _httpClient = httpClient;
  }

  [AllowAnonymous ]
  [HttpPost(nameof(Login))]
  public ActionResult<string> Login(LoginDto loginDto)
  {
    if (string.IsNullOrWhiteSpace(loginDto.Email) || string.IsNullOrWhiteSpace(loginDto.Password))
      return BadRequest("Email and password are required fields.");
    
    var user = _authUserService.GetUser(loginDto.Email, AuthProvider.EmailPassword);
    string decryptedPassword = EncryptionUtility.DecryptString(loginDto.Password, loginDto.ClientSecret);
    if (!_securityService.Authenticate(AuthProvider.EmailPassword, user, decryptedPassword))
      return BadRequest("Email or password incorrect");
    
    try
    {
      var token = _securityService.GenerateJwtToken(user);
      var refreshToken = GenerateRefreshToken();
      SetRefreshToken(refreshToken, user);
      return Ok(token);
    }
    catch (Exception e)
    {
      return StatusCode(500, "Authentication failed.");
    }
  }

  [HttpPost(nameof(Logout))]
  public ActionResult Logout()
  {
    // Retrieve the JWT token from the current request
    var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

    // Decode the token
    var handler = new JwtSecurityTokenHandler();
    var jwtToken = handler.ReadJwtToken(token);

    // Retrieve the user ID from token
    var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
    if (userId == null)
      return BadRequest("Invalid token");

    _authUserService.RemoveRefreshToken(Convert.ToInt32(userId));
    var cookieOptions = new CookieOptions()
    {
      HttpOnly = true,
      Expires = DateTime.Now.AddDays(-1),
      MaxAge = TimeSpan.Zero,
      Secure = true,
      SameSite = SameSiteMode.None
    };
    Response.Cookies.Append("refreshToken", "", cookieOptions);
    return Ok();
  }
  
  [HttpGet("RefreshToken/{userId}")]
  public ActionResult<string> RefreshToken([FromRoute] int userId)
  {
    var refreshToken = Request.Cookies["refreshToken"];
    if (refreshToken == null)
      return BadRequest("No refresh token provided");
    
    var user = _authUserService.GetUserById(userId);
    if (user == null || !refreshToken.Equals(user.RefreshToken))
    {
      return Unauthorized("Invalid refresh token");
    }
    if (user.RefreshTokenExpiryDate < DateTime.Now)
    {
      return Unauthorized("Token already expired");
    }
    
    var token = _securityService.GenerateJwtToken(user);
    var newRefreshToken = GenerateRefreshToken();
    SetRefreshToken(newRefreshToken, user);
    
    return Ok(token);
  }
  
  
  private string GenerateRefreshToken()
  {
    var randomNumber = new byte[64];
    using var rng = RandomNumberGenerator.Create();
    rng.GetBytes(randomNumber);
    return Convert.ToBase64String(randomNumber);
  }

  private void SetRefreshToken(string refreshToken, User user)
  {
    user.RefreshToken = refreshToken;
    user.RefreshTokenExpiryDate = DateTime.Now.AddDays(7);
    var updatedUser = _authUserService.Update(user);
    var cookieOptions = new CookieOptions()
    {
      HttpOnly = true,
      Expires = updatedUser.RefreshTokenExpiryDate,
      SameSite = SameSiteMode.None,
      Secure = true
    };
    Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
  }

  [Authorize]
  [HttpPost(nameof(ExistingUser))]
  public ActionResult<bool> ExistingUser([FromBody] string email)
  {
    // This endpoint should only be used when creating user with email and password
    // will return true if the user is found and false if not
    // But also we don't really want to exercise this check when user creates account as it is a security issue
    return _authUserService.UserExists(email);
  }
  
  [HttpPost(nameof(CreateUser))]
  public ActionResult<UserDto> CreateUser([FromBody] CreateUserDto newUser)
  {
    var validation = _validator.Validate(newUser);
    if (!validation.IsValid)
      return BadRequest(validation.Errors.Select(x => x.ErrorMessage).ToList());
    
    // Check if user already exists in the system
    if (_authUserService.UserExists(newUser.Email))
      return BadRequest("User with this email already exists.");
    // Already madeSure the user with those credentials doesn't exist 
    try
    {
      var authUser =
        _securityService.GenerateNewUser(AuthProvider.EmailPassword, newUser.Email, newUser.FirstName, newUser.LastName, newUser.Password, null, null);
      return new UserDto
      {
        Id = authUser.Id, 
        FirstName = authUser.FirstName,
        LastName = authUser.LastName,
        Email = authUser.Email
      };
    }
    catch (Exception e)
    {
      Console.WriteLine(e.Message);
      return StatusCode(500, "Could not create user.");
    }
  }

  [HttpPost(nameof(LoginWithGoogle))]
  public async Task<IActionResult> LoginWithGoogle([FromBody] string googleCredential)
  {
    var googleValidationSettings = new GoogleJsonWebSignature.ValidationSettings()
    {
      Audience = new List<string> { Secrets._googleClientId }
    };

    try
    {
      var googlePayload = await GoogleJsonWebSignature.ValidateAsync(googleCredential, googleValidationSettings);

      if (!new[] { "https://accounts.google.com", "accounts.google.com" }.Contains(googlePayload.Issuer))
      {
        return BadRequest("Invalid issuer.");
      }

      return await LoginWithProvider(AuthProvider.Google, googlePayload.Subject, googlePayload.Email, googlePayload.GivenName, googlePayload.FamilyName, googlePayload.Picture);
    }
    catch (InvalidJwtException)
    {
      return BadRequest("Invalid token.");
    }
  }
  
  [HttpPost(nameof(LoginWithFacebook))]
  public async Task<IActionResult> LoginWithFacebook([FromBody] string facebookAccessToken)
  {
    HttpResponseMessage debugTokenResponse = await _httpClient.GetAsync(GenerateFacebookDebugLink(facebookAccessToken));

    var debugTokenResponseContent = await debugTokenResponse.Content.ReadAsStringAsync();
    var fbUser = JsonConvert.DeserializeObject<FBUser>(debugTokenResponseContent);

    if (!fbUser.Data.IsValid)
    {
      return Unauthorized();
    }

    HttpResponseMessage userInfoResponse = await _httpClient.GetAsync($"{Secrets._facebookUserDataFetchingLink}{facebookAccessToken}");
    var userInfoResponseContent = await userInfoResponse.Content.ReadAsStringAsync();
    var fbUserInfo = JsonConvert.DeserializeObject<FBUserInfo>(userInfoResponseContent);

    return await LoginWithProvider(AuthProvider.Facebook, fbUserInfo.Id, fbUserInfo.Email, fbUserInfo.FirstName, fbUserInfo.LastName);
  }
  
  private async Task<IActionResult> LoginWithProvider(AuthProvider authProvider, string externalUserId, string userEmail, string userFirstName, string userLastName, string userImageUrl = null)
  {
    var user = _authUserService.GetUser(externalUserId, authProvider);
    var authenticationMethod = _authMethodRepository.FindByExtIdAndProvider(externalUserId, authProvider);

    if (authenticationMethod == null)
    {
      User newUser = _securityService.GenerateNewUser(authProvider, userEmail, userFirstName, userLastName, null, externalUserId, userImageUrl);
      var jwtToken = _securityService.GenerateJwtToken(newUser);
      var refreshToken = GenerateRefreshToken();
      SetRefreshToken(refreshToken, newUser);
      return Ok(jwtToken);
    } else {
      var jwtToken = _securityService.GenerateJwtToken(user);
      var refreshToken = GenerateRefreshToken();
      SetRefreshToken(refreshToken, user);
      return Ok(jwtToken);
    }
  }
  
  private string GenerateFacebookDebugLink(string credential)
  {
    return $"{Secrets._facebookCredentialVerificationLink}{credential}&access_token={Secrets._facebookAppId}|{Secrets._facebookAppSecret}";
  }

}