using Core.IServices;
using Core.Models;
using Domain.IRepositories;

namespace Domain.Services;

public class RoleService : IRoleService
{
    private readonly IRoleRepository _roleRepository;
    private readonly IUserRepository _userRepository;
    
    public RoleService(IRoleRepository repository)
    {
        _roleRepository = repository;
    }
    
    public Task<Role?> GetUserRoleForOrganisation(int userId, int organisationId)
    {
        return _roleRepository.GetUserRoleForOrganisation(userId, organisationId);
    }

    public async Task<Role> CreateRole(Role role)
    {
        return await _roleRepository.Create(role);
    }
    
    public List<Role> GetRolesPerOrganisation(int organisationId)
    {
        return _roleRepository.GetRolesPerOrganisation(organisationId);
    }
}