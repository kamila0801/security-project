using MainAPI.Dtos.Role;

namespace MainAPI.Dtos.User;

public class GetUserDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string? Address { get; set; }
    public int? PostCode { get; set; }
    public string? City { get; set; }
    public string? Email { get; set; }
    public int? PhoneNumber { get; set; }
}