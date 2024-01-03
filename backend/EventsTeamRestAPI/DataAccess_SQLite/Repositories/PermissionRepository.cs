using Core.Models;
using Domain.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace DataAccess_SQLite.Repositories;

public class PermissionRepository : IPermissionRepository
{
    private readonly MainDbContext _ctx;

    public PermissionRepository(MainDbContext ctx)
    {
        _ctx = ctx;
    }
    
    public async Task<List<Permission>> GetAll()
    {
        return await _ctx.Permissions.ToListAsync();
    }
}