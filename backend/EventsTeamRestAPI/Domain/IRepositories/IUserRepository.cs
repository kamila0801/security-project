using Core.Models;

namespace Domain.IRepositories;

public interface IUserRepository
{
    User? GetUser(int id);
    User CreateUser(User user);
    User UpdateToken(User user);
    Task<User> UpdateUser(User user);
    Task AssignRole(int userId, int newRoleId);
    void RemoveRefreshToken(int id);
}