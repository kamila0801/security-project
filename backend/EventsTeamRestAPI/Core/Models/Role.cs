namespace Core.Models;

public class Role
{
    public int Id { get; set; }
    public string Name { get; set; }
    public Organisation Organisation { get; set; }
    public int HierarchyLevel { get; set; } // 0 is highest
    public List<Permission> Permissions { get; set; } = new List<Permission>();
    public List<User> Users { get; set; } = new List<User>();
}