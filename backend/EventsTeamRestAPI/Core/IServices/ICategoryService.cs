using Core.Models;

namespace Core.IServices;

public interface ICategoryService
{
    List<Category> GetAllCategories();
}