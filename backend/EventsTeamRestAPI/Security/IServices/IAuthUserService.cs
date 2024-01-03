using Core.Models;
using Security.Enums;
using Security.Models;

namespace Security.IServices;

public interface IAuthUserService
{
  User Update(User user);
  User GetUser(string uniqueKey, AuthProvider authProvider);
  User? GetUserById(int id);
  User Create(User authUser);
  bool UserExists(string email);
  void RemoveRefreshToken(int id);
}