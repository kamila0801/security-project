using Core.Models;

namespace Domain.IRepositories;

public interface IRoleRepository
{
    Task<Role> Create(Role role);
    Task<Role?> GetUserRoleForOrganisation(int userId, int organisationId);
    List<Role> GetRolesPerOrganisation(int organisationId);
}