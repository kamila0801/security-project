using MainAPI.Dtos.Event;

namespace MainAPI.Dtos;

public class GetOrganisationWithEventsDto
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
    public string Category { get; set; }
    public string ColorHex { get; set; }
    public string ImageUrl { get; set; }
    public List<GetEventDto> Events { get; set; }
}