using Microsoft.AspNetCore.Http;

namespace Core.IServices;

public interface IFileService
{
    Task<Stream> GetFileByFileName(string bucketName, string fileName);
    Task UploadFile(IFormFile file, string fileName, string bucketName);
}