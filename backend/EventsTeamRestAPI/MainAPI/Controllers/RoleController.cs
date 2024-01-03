using System.IdentityModel.Tokens.Jwt;
using Core.IServices;
using Core.Models;
using MainAPI.Dtos.Role;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MainAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _service;
        private readonly DtoConverter _converter;
        private readonly CreateRoleDtoValidator _validator;
        private readonly IPermissionValidator _permissionValidator;

        public RoleController(IRoleService service, DtoConverter converter, CreateRoleDtoValidator validator, IPermissionValidator permissionValidator)
        {
            _service = service;
            _converter = converter;
            _validator = validator;
            _permissionValidator = permissionValidator;
        }
        
        [HttpGet("Get/{userId}/{organisationId}")]
        public async Task<ActionResult<GetRoleDto>> GetUserRoleForOrganisation([FromRoute] int userId, [FromRoute] int organisationId)
        {
            Role? role = await _service.GetUserRoleForOrganisation(userId, organisationId);
            if (role == null) return NoContent();
            return Ok(_converter.ConvertRoleToGetRoleDto(role));
        }

        [Authorize]
        [HttpPost("Create")]
        public async Task<ActionResult<Role>> CreateRole([FromBody] CreateRoleDto roleDto)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
            
            if(!_permissionValidator.IsOwner(Convert.ToInt32(userId), roleDto.OrganisationId).Result)
                return Unauthorized();
            
            var validationCheck = await _validator.ValidateAsync(roleDto);
            if (!validationCheck.IsValid)
                return BadRequest(validationCheck.Errors.Select(x => x.ErrorMessage).ToList());
            var createdRole = await _service.CreateRole(new Role()
            {
                Name = roleDto.Name,
                HierarchyLevel = roleDto.HierarchyLevel,
                Organisation = new Organisation() { Id = roleDto.OrganisationId },
                Permissions = roleDto.PermissionIds.Select(id => new Permission() { Id = id }).ToList(),
                Users = roleDto.UserIds.Select(id => new User() { Id = id }).ToList()
            });
            return Ok(_converter.ConvertRoleToGetRoleDto(createdRole));
        }
        
        [Authorize]
        [HttpGet("GetAllForOrganisation/{organisationId}")]
        public async Task<ActionResult<List<GetRoleWithUsersDto>>> GetRolesPerOrganisation([FromRoute] int organisationId)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
            
            if(!_permissionValidator.IsOwner(Convert.ToInt32(userId), organisationId).Result)
                return Unauthorized();

            var roles = _service.GetRolesPerOrganisation(organisationId);
            return Ok(roles.Select(_converter.ConvertRoleToGetRoleWithUsersDto));
        }
    }
}
