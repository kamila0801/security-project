using Core.Models;

namespace Domain.IRepositories;

public interface IEventRepository
{
    PagedResult<Event> GetAllEvents(EventsFilter filters);
    Task<Event> CreateEvent(Event eventToCreate);
    Task<Event> UpdateEvent(Event eventToUpdate);
}