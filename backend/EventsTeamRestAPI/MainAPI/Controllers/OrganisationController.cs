using Core.Constants;
using Core.IServices;
using Core.Models;
using MainAPI.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MainAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrganisationController : ControllerBase
    {
        private readonly IOrganisationService _organisationService;
        private readonly CreateOrganisationDtoValidator _validator;
        private readonly DtoConverter _converter;

        public OrganisationController(IOrganisationService organisationService, CreateOrganisationDtoValidator validator, DtoConverter dtoConverter, IUserService userService, IRoleService roleService)
        {
            _organisationService = organisationService;
            _validator = validator;
            _converter = dtoConverter;
        }

        [HttpGet("{skip}/{take}")]
        public ActionResult<PagedResult<GetOrganisationDto>> Get(
            [FromRoute] int skip, [FromRoute] int take,
            [FromQuery] string? categoryId = null, [FromQuery] string? sortBy = null,
            [FromQuery] string? sortOrder = SortingOrderEnum.ASC,
            [FromQuery] string? textSearch = null)
        {
            string[] numberStrings = categoryId != null ? categoryId.Split(',') : Array.Empty<string>();
            List<int> categoryIdArray = numberStrings.Select(int.Parse).ToList();
            var filter = new OrganisationsFilter()
            {
                Skip = skip, Take = take, CategoryId = categoryIdArray, SortBy = sortBy, SortOrder = sortOrder,
                TextSearch = textSearch
            };
            
            var organisations = _organisationService.GetAllOrganisations(filter);
            var mappedOrganisations = new PagedResult<GetOrganisationDto>
                {Total = organisations.Total, Data = organisations.Data.Select(_converter.ConvertOrganisationToGetDto).ToList()};
            return Ok(mappedOrganisations);
        }

        [HttpGet("{id}")]
        public ActionResult<GetOrganisationDto> Get(int id)
        {
            var org = _organisationService.GetOrganisation(id);
            return Ok(_converter.ConvertOrganisationToGetDto(org));
        }
        
        [Authorize]
        [HttpPost("create")]
        public async Task<ActionResult<GetOrganisationDto>> Post([FromForm] CreateOrganisationDTO organisationDto)
        {
            var validationCheck = _validator.Validate(organisationDto);
            if (!validationCheck.IsValid)
                return BadRequest(validationCheck.Errors.Select(x => x.ErrorMessage).ToList());
            
            var org = await _organisationService.CreateOrganisation(new Organisation()
            {
                Name = organisationDto.Name,
                Tagline = organisationDto.Tagline ?? "",
                Address = organisationDto.Address,
                PostCode = organisationDto.PostCode,
                City = organisationDto.City,
                Description = organisationDto.Description,
                Email = organisationDto.Email,
                PhoneNumber = organisationDto.PhoneNumber,
                RegNumber = organisationDto.RegNumber,
                AccountNumber = organisationDto.AccountNumber,
                ColorHex = organisationDto.ColorHex,
                ImageUrl = "",
                Category = new Category() {Id = organisationDto.CategoryId},
                Owner = new User() {Id = organisationDto.OwnerId}
            }, organisationDto.File);
            return Ok(_converter.ConvertOrganisationToGetDto(org));
        }
    }
}
