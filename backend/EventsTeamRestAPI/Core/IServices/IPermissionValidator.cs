using Core.Constants;

namespace Core.IServices;

public interface IPermissionValidator
{
    Task<bool> HasPermission(int userId, int organisationId, PermissionEnum permissionEnum);
    Task<bool> IsOwner(int userId, int organisationId);
}