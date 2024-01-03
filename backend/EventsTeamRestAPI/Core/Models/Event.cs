namespace Core.Models;

public class Event
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string ShortDescription { get; set; }
    public string FullDescription { get; set; }
    public string Address { get; set; }
    public int PostCode { get; set; }
    public string City { get; set; }
    public DateTime Date { get; set; }
    public Organisation Organisation { get; set; }
    public List<Ticket> Tickets { get; set; }
    public string ColorHex { get; set; }
    public string ImageUrl { get; set; }
}