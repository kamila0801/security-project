using Core.Constants;
using Core.IServices;

namespace Domain.Services;

public class PermissionValidator : IPermissionValidator
{
    private readonly IRoleService _roleService;

    public PermissionValidator(IRoleService roleService)
    {
        _roleService = roleService;
    }
        
    public async Task<bool> HasPermission(int userId, int organisationId, PermissionEnum permissionEnum)
    {
        var role = await _roleService.GetUserRoleForOrganisation(Convert.ToInt32(userId), organisationId);
        return
            role != null
            && role.Permissions.Exists(p => p.Name.Equals(permissionEnum.ToString()));
    }
    
    public async Task<bool> IsOwner(int userId, int organisationId)
    {
        var role = await _roleService.GetUserRoleForOrganisation(Convert.ToInt32(userId), organisationId);
        return role is {HierarchyLevel: 0};
    } 
}