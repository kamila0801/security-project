using Core.Constants;
using Core.IServices;
using Core.Models;
using Domain.IRepositories;
using Microsoft.AspNetCore.Http;

namespace Domain.Services;

public class EventService : IEventService
{
    private IEventRepository _repo;
    private readonly IFileService _fileService;

    public EventService(IEventRepository repo, IFileService fileService)
    {
        _repo = repo;
        _fileService = fileService;
    }

    public PagedResult<Event> GetAllEvents(EventsFilter filter)
    {
        return _repo.GetAllEvents(filter);
    }

    public async Task<Event> CreateEvent(Event eventToCreate, IFormFile file)
    {
        var created = await _repo.CreateEvent(eventToCreate);
        var fileName = "logo-" + created.Id;
        try
        {
            await _fileService.UploadFile(file, fileName, StorageBuckets.EVENT_LOGO);
            created.ImageUrl = fileName;
            UpdateEvent(created);
        }
        catch (Exception e)
        {
            Console.WriteLine("Could not upload file");
            Console.WriteLine(e);
            throw new Exception("Could not upload file: " + e.Message);
        }
        
        return created;
    }

    public async Task<Event> UpdateEvent(Event eventToUpdate)
    {
        return await _repo.UpdateEvent(eventToUpdate);
    }
}