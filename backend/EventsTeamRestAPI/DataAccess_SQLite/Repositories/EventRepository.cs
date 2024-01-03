
using Core.Exceptions;
using Core.Constants;
using Core.Models;
using Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace DataAccess_SQLite.Repositories;

public class EventRepository : IEventRepository
{
    private readonly MainDbContext _ctx;

    public EventRepository(MainDbContext ctx)
    {
        _ctx = ctx;
    }

    public PagedResult<Event> GetAllEvents(EventsFilter filters)
    {
        var statement = _ctx.Event
            .Include(e => e.Organisation)
            .Include(e => e.Organisation.Category)
            .Include(e => e.Tickets)
            .Select(e => e);
        
        if (filters.OrganisationId != null)
            statement = statement.Where(e => e.Organisation.Id == filters.OrganisationId);
        
        if (!filters.CategoryId.IsNullOrEmpty())
            statement = statement.Where(e => filters.CategoryId.Contains(e.Organisation.Category.Id));

        if (!string.IsNullOrEmpty(filters.TextSearch))
        {
            statement = statement.Where(e => 
                e.Name.ToLower().Contains(filters.TextSearch.ToLower())
                || e.ShortDescription.ToLower().Contains(filters.TextSearch.ToLower()));
        }
        
        if (filters.MinPrice != null)
        {
            statement = statement.Where(e => !e.Tickets.Any(t => t.Price < filters.MinPrice));
        }
        
        if (filters.MaxPrice != null)
        {
            statement = statement.Where(e => !e.Tickets.Any(t => t.Price > filters.MaxPrice));
        }
        
        if (filters.SortBy != null)
        {
            if (filters.SortOrder == SortingOrderEnum.DESC)
            {
                statement = filters.SortBy switch
                {
                    SortingEnum.DATE => statement.OrderByDescending(e => e.Date),
                    SortingEnum.NAME => statement.OrderByDescending(e => e.Name),
                    _ => statement
                };
            }
            else if (filters.SortOrder == SortingOrderEnum.ASC)
            {
                statement = filters.SortBy switch
                {
                    SortingEnum.DATE => statement.OrderBy(e => e.Date),
                    SortingEnum.NAME => statement.OrderBy(e => e.Name),
                    _ => statement
                };
            }
            
        }

        var totalCount = statement.Count();
        statement = statement.Skip(filters.Skip).Take(filters.Take);

        return new PagedResult<Event> {Data = statement.ToList(), Total = totalCount};
    }

    public async Task<Event> CreateEvent(Event eventToCreate)
    {
        eventToCreate = await ValidateAndAssignRelations(eventToCreate);
        Event createdEvent = _ctx.Add(eventToCreate).Entity;
        await _ctx.SaveChangesAsync();
        return createdEvent;
    }

    public async Task<Event> UpdateEvent(Event eventToUpdate)
    {
        eventToUpdate = await ValidateAndAssignRelations(eventToUpdate);
        _ctx.Attach(eventToUpdate).State = EntityState.Modified;
        await _ctx.SaveChangesAsync();
        return eventToUpdate;
    }

    private async Task<Event> ValidateAndAssignRelations(Event eveent)
    {
        Organisation? organisation = await _ctx.Organisation.Include(o => o.Category).FirstOrDefaultAsync(o => o.Id == eveent.Organisation.Id);
        if (organisation == null)
            throw new ResourceNotFoundException("Incorrect organisation id: organisation with that id doesn't exist",
                "organisationId");
        eveent.Organisation = organisation;
        return eveent;
    }
}