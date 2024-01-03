using Core.IServices;
using Core.Models;
using Domain.IRepositories;

namespace Domain.Services;

public class CategoryService : ICategoryService
{
    private ICategoryRepository _repo; 
  
    public CategoryService(ICategoryRepository repository)
    {
        _repo = repository;
    }
    public List<Category> GetAllCategories()
    {
        return _repo.GetAllCategories();
    }
}