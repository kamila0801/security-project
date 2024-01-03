namespace Core.Models;

public class User
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string? Address { get; set; }
    public int? PostCode { get; set; }
    public string? City { get; set; }
    public string? Email { get; set; }
    public int? PhoneNumber { get; set; }
    public int? AuthId{ get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryDate { get; set; }
    public List<Role> Roles { get; set; } = new List<Role>();
}