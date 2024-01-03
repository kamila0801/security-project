using Core;
using Core.IServices;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Storage.V1;
using Microsoft.AspNetCore.Http;

namespace Domain.Services;

public class FileService : IFileService
{
    private readonly StorageClient _client;
    
    public FileService()
    {
        string credentialPath = Secrets.localJsonPath;
        var credential = GoogleCredential.FromFile(credentialPath);
        _client = StorageClient.Create(credential);
    }
    
    public async Task<Stream> GetFileByFileName(string bucketName, string fileName)
    {
        try
        {
            // Download the file from Google Cloud Storage
            MemoryStream stream = new MemoryStream();
            await _client.DownloadObjectAsync(bucketName, fileName, stream);
            stream.Position = 0;
            return stream;
        }
        catch (Exception e)
        {
            Console.WriteLine("Could not fetch file for name: " + fileName + ", with message: " + e.Message);
        }
        return Stream.Null;
    }
    
    public async Task UploadFile(IFormFile file, string fileName, string bucketName)
    {
        using (var stream = new MemoryStream())
        {
            await file.CopyToAsync(stream);
            stream.Seek(0, SeekOrigin.Begin);
            await _client.UploadObjectAsync(bucketName, fileName, file.ContentType, stream);
        }
    }
}