namespace Core.Models;

public class PagedResult<T>
{
    public int Total { get; set; }
    public List<T> Data { get; set; }
}