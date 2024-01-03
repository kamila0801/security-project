using Core.Models;

namespace Domain.IRepositories;

public interface IPermissionRepository
{
    public Task<List<Permission>> GetAll();
}