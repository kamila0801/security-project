namespace Core.Models;

public class Filter
{
    public int Skip { get; set; }
    public int Take { get; set; }
    public string? SortBy { get; set; }
    public string? SortOrder { get; set; }
    public string? TextSearch { get; set; }

}