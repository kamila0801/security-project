using MainAPI.Dtos.Ticket;

namespace MainAPI.Dtos.Event;

public class GetEventDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string ShortDescription { get; set; }
    public string FullDescription { get; set; }
    public DateTime Date { get; set; }
    public string Price { get; set; }
    public List<CreateTicketDto> Tickets { get; set; }
    public string OrganisationName { get; set; }
    public string OrganisationCategory { get; set; }
    public int OrganisationEventsCount { get; set; }
    public string ImageUrl { get; set; }
    public string ColorHex { get; set; }
}