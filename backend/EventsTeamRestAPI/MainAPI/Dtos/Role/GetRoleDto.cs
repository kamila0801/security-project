using Core.Models;

namespace MainAPI.Dtos.Role;

public class GetRoleDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int OrganisationId { get; set; }
    public int HierarchyLevel { get; set; } // 0 is highest
    public List<Permission> Permissions { get; set; }
}