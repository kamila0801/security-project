using Core.Models;
using Domain.IRepositories;

namespace DataAccess_SQLite.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly MainDbContext _ctx;

    public CategoryRepository(MainDbContext ctx)
    {
        _ctx = ctx;
    }
    public List<Category> GetAllCategories()
    {
        return _ctx.Category.Select(cat => cat).ToList();
    }
}