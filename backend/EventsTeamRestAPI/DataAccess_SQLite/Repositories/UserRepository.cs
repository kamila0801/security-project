using Core.Exceptions;
using Core.Models;
using Domain.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace DataAccess_SQLite.Repositories;

public class UserRepository : IUserRepository
{
    private readonly MainDbContext _ctx;

    public UserRepository(MainDbContext ctx)
    {
        _ctx = ctx;
    }

    public User? GetUser(int id)
    {
        return _ctx.User.FirstOrDefault(u => u.Id == id);
    }

    public User CreateUser(User user)
    {
        User newUser = _ctx.Add(user).Entity;
        _ctx.SaveChanges();
        return newUser;
    }

    public User UpdateToken(User user)
    {
        var userToUpdate = _ctx.User.FirstOrDefault(u => u.Id == user.Id);
        userToUpdate.RefreshToken = user.RefreshToken;
        userToUpdate.RefreshTokenExpiryDate = user.RefreshTokenExpiryDate;
        _ctx.Attach(userToUpdate).State = EntityState.Modified;
        _ctx.SaveChanges();
        return userToUpdate;
    }

    public async Task<User> UpdateUser(User user)
    {
        var userToUpdate = await _ctx.User.FirstOrDefaultAsync(u => u.Id == user.Id);
        if (userToUpdate == null)
            throw new ResourceNotFoundException("User with that id doesnt exist.", "id");
        
        userToUpdate.FirstName = user.FirstName;
        userToUpdate.LastName = user.LastName;
        userToUpdate.Address = user.Address;
        userToUpdate.City = user.City;
        userToUpdate.PostCode = user.PostCode;
        userToUpdate.Email = user.Email;
        userToUpdate.PhoneNumber = user.PhoneNumber;
        _ctx.Attach(userToUpdate).State = EntityState.Modified;
        await _ctx.SaveChangesAsync();
        return userToUpdate;
    }

    public async Task AssignRole(int userId, int newRoleId)
    {
        var fetchUser = _ctx.User.FirstOrDefaultAsync(user => user.Id == userId);
        var fetchRole = _ctx.Roles.FirstOrDefaultAsync(r => r.Id == newRoleId);

        await Task.WhenAll(fetchUser, fetchRole);

        var userToUpdate = fetchUser.Result;
        var role = fetchRole.Result;

        if (userToUpdate == null)
            throw new ResourceNotFoundException("Incorrect user id: User with that id doesn't exist.", "userId: " + userId);
        if (role == null)
            throw new ResourceNotFoundException("Incorrect role id: Role with that id doesn't exist.", "roleId: " + newRoleId);
        
        userToUpdate.Roles.Add(role);
        _ctx.Attach(userToUpdate).State = EntityState.Modified;
        await _ctx.SaveChangesAsync();
    }
    
    public void RemoveRefreshToken(int id)
    {
        var userToUpdate = _ctx.User.FirstOrDefault(user => user.Id == id);
        userToUpdate.RefreshToken = null;
        userToUpdate.RefreshTokenExpiryDate = null;
        _ctx.Attach(userToUpdate).State = EntityState.Modified;
        _ctx.SaveChanges();
    }

}