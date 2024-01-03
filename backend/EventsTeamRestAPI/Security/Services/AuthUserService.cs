using Security.Enums;
using Core.Models;
using Domain.IRepositories;
using Security.IRepositories;
using Security.IServices;
using Security.Models;

namespace Security.Services;

public class AuthUserService: IAuthUserService
{
  // private readonly IAuthUserRepository _authUserRepo;
  private readonly IUserRepository _userRepo;
  private readonly IUserAuthMethodRepository _authMethodRepo;

  public AuthUserService(IUserRepository userRepo, IUserAuthMethodRepository userAuthMethodRepository)
  {
    _userRepo = userRepo;
    _authMethodRepo = userAuthMethodRepository;
  }
    
  public User GetUser(string uniqueKey, AuthProvider authProvider)
  {
    User user = null;
    if (authProvider == AuthProvider.EmailPassword)
    {
      var authMethod = _authMethodRepo.FindByEmailAndProvider(uniqueKey, authProvider);
      if (authMethod != null)
      {
        user = _userRepo.GetUser(authMethod.UserId);
        user.AuthId = authMethod.Id;
      }
    }
    else
    {
      var authMethod = _authMethodRepo.FindByExtIdAndProvider(uniqueKey, authProvider);
      if (authMethod != null)
      {
        user = _userRepo.GetUser(authMethod.UserId);
        user.AuthId = authMethod.Id;
      }
    }
    return user;
  }

  public User? GetUserById(int userId)
  {
    return _userRepo.GetUser(userId);
  }
  

  public User Create(User authUser)
  {
    //TODO: we should use transaction to ensure that we either create this object in both tables or neither of them!
    User newUser = _userRepo.CreateUser(new User()
    {
      Id = authUser.Id,
      FirstName = authUser.FirstName,
      LastName = authUser.LastName,
      Email = authUser.Email
    });
    return newUser;
  }

  public User Update(User user)
  {
    return _userRepo.UpdateToken(user);
  }

  public bool UserExists(string email)
  {
    var authMethod = _authMethodRepo.FindByEmailAndProvider(email, AuthProvider.EmailPassword);
    return authMethod != null;
  }

  public void RemoveRefreshToken(int id)
  {
    _userRepo.RemoveRefreshToken(id);
  }
}