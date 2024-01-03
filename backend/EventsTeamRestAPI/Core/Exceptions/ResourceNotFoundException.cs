using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Core.Exceptions;

public class ResourceNotFoundException : Exception
{
    public string Property { get; }
    
    public ResourceNotFoundException(string message, string property) : base(message)
    {
        Property = property;
    }
}

public class ResourceNotFoundExceptionFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        if (context.Exception is ResourceNotFoundException)
        {
            ResourceNotFoundException exception = (ResourceNotFoundException) context.Exception;
            context.Result = new ObjectResult(new ExceptionDto()
            {
                Timestamp = DateTime.Now,
                Field = exception.Property,
                Message = exception.Message
            })
            {
                StatusCode = StatusCodes.Status400BadRequest
            };
            context.ExceptionHandled = true;
        }
    }
}