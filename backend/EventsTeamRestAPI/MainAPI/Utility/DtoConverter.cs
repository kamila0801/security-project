using Core.IServices;
using Core.Models;
using MainAPI.Dtos;
using MainAPI.Dtos.Event;
using MainAPI.Dtos.Role;
using MainAPI.Dtos.Ticket;
using MainAPI.Dtos.User;

namespace MainAPI.Controllers;

public class DtoConverter
{
    //ORGANISATION -----------------------------------------------------------------------
    public GetOrganisationDto ConvertOrganisationToGetDto(Organisation org)
    {
        return new GetOrganisationDto()
        {
            Id = org.Id,
            Name = org.Name,
            Tagline = org.Tagline,
            Address = org.Address,
            PostCode = org.PostCode,
            City = org.City,
            Description = org.Description,
            PhoneNumber = org.PhoneNumber,
            Email = org.Email,
            Category = org.Category.Name,
            ColorHex = org.ColorHex,
            ImageUrl = org.ImageUrl
        };
    }

    //EVENTS --------------------------------------------------------------------------------
    public GetEventDto ConvertEventToGetDto(Event e)
    {
        return new GetEventDto()
        {
            Id = e.Id,
            Name = e.Name,
            Date = e.Date,
            ShortDescription = e.ShortDescription,
            FullDescription = e.FullDescription,
            Price = GetEventPrice(e.Tickets),
            Tickets = e.Tickets.Count > 0 ? e.Tickets.Select(t => new CreateTicketDto(){Type = t.Type, Price = t.Price}).ToList() : new List<CreateTicketDto>(),
            OrganisationCategory = e.Organisation.Category.Name,
            OrganisationName = e.Organisation.Name,
            OrganisationEventsCount = e.Organisation.Events.Count,
            ImageUrl = e.ImageUrl,
            ColorHex = e.ColorHex
        };
    }

    private string GetEventPrice(List<Ticket> tickets)
    {
        if (tickets.Count == 0) return "";
        if (tickets.Count == 1) return tickets[0].Price.ToString();
        
        var min = tickets.Min(t => t.Price);
        var max = tickets.Max(t => t.Price);
        return min + " - " + max;
    }
    
    //USER -------------------------------------------------------------------------------------
    public GetUserDto ConvertUserToGetDto(User user)
    {
        return new GetUserDto()
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Address = user.Address,
            City = user.City,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            PostCode = user.PostCode
        };
    }
    
    //ROLES ----------------------------------------------------------------------------------
    public GetRoleDto ConvertRoleToGetRoleDto(Role role)
    {
        return new GetRoleDto()
        {
            Id = role.Id,
            Name = role.Name,
            HierarchyLevel = role.HierarchyLevel,
            OrganisationId = role.Organisation.Id,
            Permissions = role.Permissions
        };
    }

    public GetRoleWithUsersDto ConvertRoleToGetRoleWithUsersDto(Role role)
    {
        return new GetRoleWithUsersDto()
        {
            Id = role.Id,
            Name = role.Name,
            HierarchyLevel = role.HierarchyLevel,
            Permissions = role.Permissions,
            Users = role.Users.Select(u => new SimpleUserDto()
            {
                Id = u.Id,
                FullName = u.FirstName + " " + u.LastName
            }).ToList()
        };
    }
}