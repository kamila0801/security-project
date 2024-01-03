using Core.Models;
using Security.Enums;
using Security.Models;

namespace Security.IServices;

public interface ISecurityService
{
  string GenerateJwtToken(User user);
  string HashedPassword(byte[] userSalt, string password);
  User GenerateNewUser(AuthProvider authprovider, string email, string firstName, string lastName, string? password, string? externalId, string? profilePictureLink );
  byte[] GenerateSalt();
  bool Authenticate(AuthProvider authProvider, User user, string loginDtoPassword);
}