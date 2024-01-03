using Core.Models;

namespace Core.IServices;

public interface IRoleService
{
    Task<Role?> GetUserRoleForOrganisation(int userId, int organisationId);
    Task<Role> CreateRole(Role role);
    List<Role> GetRolesPerOrganisation(int organisationId);
}