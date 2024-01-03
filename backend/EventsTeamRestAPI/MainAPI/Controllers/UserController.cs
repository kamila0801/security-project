using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.IServices;
using Core.Models;
using MainAPI.Dtos.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MainAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly DtoConverter _converter;

        public UserController(IUserService userService, DtoConverter converter)
        {
            _userService = userService;
            _converter = converter;
        }
        
        [Authorize]
        [HttpGet("Get/{userId}")]
        public ActionResult<User> GetUser([FromRoute] int userId)
        {
            var user = _userService.GetUser(userId);
            if (user == null)
                return BadRequest("No user found with that id");
            return Ok(_converter.ConvertUserToGetDto(user));
        }
        
        [Authorize]
        [HttpPut("Update")]
        public async Task<ActionResult<User>> UpdateUser([FromBody] GetUserDto userDto)
        {
            // TODO: add validator
            var user = await _userService.UpdateUser(new User()
            {
                Id = userDto.Id, FirstName = userDto.FirstName, LastName = userDto.LastName,
                Address = userDto.Address, City = userDto.City, PostCode = userDto.PostCode,
                Email = userDto.Email, PhoneNumber = userDto.PhoneNumber
            });
            return Ok(_converter.ConvertUserToGetDto(user));
        }
    }
}
