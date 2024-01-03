using Core.Constants;
using Core.IServices;
using Core.Models;
using MainAPI.Dtos.Event;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MainAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly IEventService _service;
        private readonly DtoConverter _converter;
        private readonly CreateEventDtoValidator _validator;
        
        public EventController(IEventService service, DtoConverter dtoConverter, CreateEventDtoValidator validator)
        {
            _service = service;
            _converter = dtoConverter;
            _validator = validator;
        }

        [HttpGet("{skip}/{take}")]
        public ActionResult<PagedResult<GetEventDto>> GetAll(
            [FromRoute] int skip, [FromRoute] int take, 
            [FromQuery] string? categoryId = null, [FromQuery] string? sortBy = null, 
            [FromQuery] string? sortOrder = SortingOrderEnum.ASC,
            [FromQuery] int? maxPrice = null, [FromQuery] int? minPrice = null,
            [FromQuery] string? textSearch = null, [FromQuery] int? orgId = null)
        {
            string[] numberStrings = categoryId != null ? categoryId.Split(',') : Array.Empty<string>();
            List<int> categoryIdArray = numberStrings.Select(int.Parse).ToList();
            
            var filters = new EventsFilter
            {
                Skip = skip, Take = take, CategoryId = categoryIdArray, SortBy = sortBy, SortOrder = sortOrder,
                TextSearch = textSearch, MaxPrice = maxPrice, MinPrice = minPrice, OrganisationId = orgId
            };
            var events = _service.GetAllEvents(filters);
            var mappedEvents = new PagedResult<GetEventDto>
                {Total = events.Total, Data = events.Data.Select(_converter.ConvertEventToGetDto).ToList()};
            return Ok(mappedEvents);
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<ActionResult<GetEventDto>> CreateEvent([FromForm] CreateEventDto eventDto) {
            var validationCheck = await _validator.ValidateAsync(eventDto);
            if (!validationCheck.IsValid)
                return BadRequest(validationCheck.Errors.Select(x => x.ErrorMessage).ToList());
            
            var createdEvent = await _service.CreateEvent(new Event()
            {
                Name = eventDto.Name,
                ShortDescription = eventDto.ShortDescription,
                FullDescription = eventDto.FullDescription,
                Address = eventDto.Address,
                PostCode = eventDto.PostCode,
                City = eventDto.City,
                Date = eventDto.Date,
                ColorHex = eventDto.ColorHex,
                ImageUrl = "",
                Organisation = new Organisation(){Id = eventDto.OrganisationId},
                Tickets = eventDto.Tickets.Select(t => new Ticket()
                {
                    Price = t.Price, Type = t.Type
                }).ToList()
            }, eventDto.File);
            return Ok(_converter.ConvertEventToGetDto(createdEvent));
        }
    }
}
