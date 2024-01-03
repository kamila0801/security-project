using Core.Exceptions;
using Core.Models;
using Domain.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace DataAccess_SQLite.Repositories;

public class RoleRepository : IRoleRepository
{
    private readonly MainDbContext _ctx;

    public RoleRepository(MainDbContext ctx)
    {
        _ctx = ctx;
    }

    public async Task<Role> Create(Role role)
    {
        Organisation? organisation = await _ctx.Organisation.FirstOrDefaultAsync(u => u.Id == role.Organisation.Id);
        if (organisation == null)
            throw new ResourceNotFoundException("Incorrect organisation id: Organisation with this id doesn't exist.", "organisationId");
        
        var existingPermissionIds = role.Permissions.Select(p => p.Id);
        var existingPermissions = _ctx.Permissions
            .Where(p => existingPermissionIds.Contains(p.Id))
            .ToList();
        if (existingPermissions.Count == 0)
            throw new ResourceNotFoundException("Incorrect permission id: Role should contain at least one permission. All passed permission ids don't exist.", "permissionIds");
        
        var existingUserIds = role.Users.Select(u => u.Id);
        var existingUsers = _ctx.User
            .Where(u => existingUserIds.Contains(u.Id))
            .ToList();
        if (existingUsers.Count == 0)
            throw new ResourceNotFoundException("Incorrect user id: Role should contain at least one user. All passed user ids don't exist.", "userId");
        
        role.Organisation = organisation;
        role.Permissions = existingPermissions;
        role.Users = existingUsers;
        var createdRole = _ctx.Add(role).Entity;
        await _ctx.SaveChangesAsync();
        return createdRole;
    }

    public async Task<Role?> GetUserRoleForOrganisation(int userId, int organisationId)
    {
        User? user = await _ctx.User.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
            throw new ResourceNotFoundException("Incorrect user id: User with this id doesn't exist.", "userId");
        
        Role? role = await _ctx.Roles
            .Include(r=> r.Permissions)
            .Include(r => r.Organisation)
            .Where(r => r.Users.Contains(user) && r.Organisation.Id == organisationId)
            .FirstOrDefaultAsync();
        return role;
    }
    
    public List<Role> GetRolesPerOrganisation(int organisationId)
    {
        return _ctx.Roles
            .Include(r => r.Permissions)
            .Include(r => r.Users)
            .Include(r => r.Organisation)
            .Where(r => r.Organisation.Id == organisationId)
            .ToList();
    }
}