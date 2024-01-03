using System.IdentityModel.Tokens.Jwt;
using System.Security.Authentication;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Core.Models;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Security.Enums;
using Security.IRepositories;
using Security.IServices;
using Security.Models;

namespace Security.Services;

public class SecurityService: ISecurityService
{
  private readonly IAuthUserService _authServ;
  private readonly IUserAuthMethodRepository _authMethodRepository;
    private IConfiguration Configuration { get; set; }
    public SecurityService(IConfiguration configuration, IAuthUserService authServ, IUserAuthMethodRepository authMethodRepository)
    {
      Configuration = configuration;
      _authServ = authServ;
      _authMethodRepository = authMethodRepository;
    }

    public string GenerateJwtToken(User user)
    {
      List<Claim> claims = new List<Claim>()
      {
        new Claim("email", user.Email),
        new Claim("userId", user.Id.ToString())
      };
      
      var securityKey =
        new SymmetricSecurityKey(
          Encoding.UTF8.GetBytes(Configuration["jwtConfig:secret"]));
      var credentials =
        new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
      var token = new JwtSecurityToken(Configuration["jwtConfig:issuer"],
        Configuration["jwtConfig:audience"],
        claims,
        expires: DateTime.Now.AddMinutes(15),
        signingCredentials: credentials);

      var jwt = new JwtSecurityTokenHandler().WriteToken(token);
      return jwt;
    }

    public bool Authenticate(AuthProvider authProvider, User user, string password)
    {
      var authMethod = _authMethodRepository.FindById(user.AuthId);

      if (authMethod != null && authProvider == AuthProvider.EmailPassword)
      {
        if (user == null || authMethod.PasswordHash.Length <= 0 || authMethod.PasswordSalt.Length <= 0) return false;
      
        var hashedPassword = HashedPassword(authMethod.PasswordSalt, password);

        return hashedPassword.Equals(authMethod.PasswordHash);
      }
      
      return false;
    }

    public string HashedPassword(byte[] userSalt, string password)
    {
      return Convert.ToBase64String(KeyDerivation.Pbkdf2(
        password: password,
        salt: userSalt,
        prf: KeyDerivationPrf.HMACSHA256,
        iterationCount: 100000,
        numBytesRequested: 256 / 8));
    }

    public User GenerateNewUser(AuthProvider authProvider, string email, string firstName,
      string lastName, string? password, string? externalId, string? profilePictureLink)
    {
      User createdUser;
      if (authProvider == AuthProvider.EmailPassword)
      {
        createdUser = _authServ.Create(new User
        {
          FirstName = firstName,
          LastName = lastName,
          Email = email,
          // ProfilePicture = profilePictureLink
        });

        // generate a 128-bit salt using a cryptographically strong random sequence of nonzero values
        var salt = GenerateSalt();

        var hashedPassword = HashedPassword(salt, password);
        
        var createdAuthMethod = _authMethodRepository.CreateAuthMethod(new AuthMethod
        {
          UserId = createdUser.Id,
          Provider = authProvider,
          Email = email,
          PasswordSalt = salt,
          PasswordHash = hashedPassword,
          CreatedAt = DateTime.Now,
          UpdatedAt = DateTime.Now
        });
      }
      else
      {
        createdUser = _authServ.Create(new User()
        {
          FirstName = firstName,
          LastName = lastName,
          Email = email,
          // ProfilePicture = profilePictureLink
        });
          
        var createdAuthMethod = _authMethodRepository.CreateAuthMethod(new AuthMethod
        {
          UserId = createdUser.Id,
          Provider = authProvider,
          ExternalUserId = externalId,
          CreatedAt = DateTime.Now,
          UpdatedAt = DateTime.Now
        });
      }
      return createdUser;
    }


    public byte[] GenerateSalt()
    {
      var salt = new byte[128 / 8];
      using (var rngCsp = new RNGCryptoServiceProvider())
      {
        rngCsp.GetNonZeroBytes(salt);
      }

      return salt;
    }
}