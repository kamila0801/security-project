using Core.Constants;

namespace Core.Models;

public class EventsFilter : Filter
{
    public List<int> CategoryId { get; set; }
    public int? MinPrice { get; set; }
    public int? MaxPrice { get; set; }
    public int? OrganisationId { get; set; }
}