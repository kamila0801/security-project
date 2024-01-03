namespace Core.Exceptions;

public class ExceptionDto
{
    public DateTime Timestamp { get; set; }
    public string Field { get; set; }
    public string Message { get; set; }
}