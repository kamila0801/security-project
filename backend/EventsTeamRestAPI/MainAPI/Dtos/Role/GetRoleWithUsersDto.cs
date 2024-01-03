using Core.Models;
using MainAPI.Dtos.User;

namespace MainAPI.Dtos.Role;

public class GetRoleWithUsersDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int HierarchyLevel { get; set; } // 0 is highest
    public List<Permission> Permissions { get; set; }
    public List<SimpleUserDto> Users { get; set; }
}