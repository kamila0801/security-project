using Core.Models;
using Microsoft.AspNetCore.Http;

namespace Core.IServices;

public interface IEventService
{
    PagedResult<Event> GetAllEvents(EventsFilter filters);
    Task<Event> CreateEvent(Event eventToCreate, IFormFile eventDtoFile);
    Task<Event> UpdateEvent(Event eventToUpdate);
}