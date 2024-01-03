using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.IServices;
using Core.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MainAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private ICategoryService _categoryService;
        
        public CategoryController(ICategoryService service)
        {
            _categoryService = service;
        }
        
        [HttpGet]
        public ActionResult<List<Category>> Get()
        {
            return Ok(_categoryService.GetAllCategories());
        }
    }
}
