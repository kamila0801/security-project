using Core.Models;

namespace Core.IServices;

public interface IUserService
{
    User? GetUser(int id);
    Task AssignRole(int userId, int newRoleId);
    Task<User> UpdateUser(User user);
}