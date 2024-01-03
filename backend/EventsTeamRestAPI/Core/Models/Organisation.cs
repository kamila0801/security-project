namespace Core.Models;

public class Organisation
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Tagline { get; set; }
    public string Address { get; set; }
    public int PostCode { get; set; }
    public string City { get; set; }
    public string Description { get; set; }
    public int PhoneNumber { get; set; }
    public string Email { get; set; }
    public int? RegNumber { get; set; }
    public int? AccountNumber { get; set; }
    public string ColorHex { get; set; }
    public string ImageUrl { get; set; }
    public Category Category { get; set; }
    public User Owner { get; set; }
    public List<Event> Events { get; set; } = new List<Event>();
    public List<Role> Roles { get; set; } = new List<Role>();
}