using Core.IServices;
using Core.Models;
using Domain.IRepositories;

namespace Domain.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _repo;

    public UserService(IUserRepository repo)
    {
        _repo = repo;
    }
    
    public User? GetUser(int id)
    {
        return _repo.GetUser(id);
    }

    public async Task AssignRole(int userId, int newRoleId)
    {
        await _repo.AssignRole(userId, newRoleId);
    }

    public async Task<User> UpdateUser(User user)
    {
        return await _repo.UpdateUser(user);
    }
}