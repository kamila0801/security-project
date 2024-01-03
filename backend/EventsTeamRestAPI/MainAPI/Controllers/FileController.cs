using Core.Constants;
using Core.IServices;
using Microsoft.AspNetCore.Mvc;

namespace MainAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IFileService _fileService;

        public FileController(IFileService fileService)
        {
            _fileService = fileService;
        }
        
        [HttpGet("organisation/{fileName}")]
        public async Task<IActionResult> GetOrganisationLogo(string fileName)
        {
            var stream = await _fileService.GetFileByFileName(StorageBuckets.ORGANISATION_LOGO, fileName);
            if (stream == Stream.Null)
                return NotFound();
            return File(stream, "application/octet-stream", fileName);
        }
        
        [HttpGet("event/{fileName}")]
        public async Task<IActionResult> GetEventLogo(string fileName)
        {
            var stream = await _fileService.GetFileByFileName(StorageBuckets.EVENT_LOGO, fileName);
            if (stream == Stream.Null)
                return NotFound();
            return File(stream, "application/octet-stream", fileName);
        }
    }
}
