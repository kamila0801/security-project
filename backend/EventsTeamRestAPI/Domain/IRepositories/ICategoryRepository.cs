using Core.Models;

namespace Domain.IRepositories;

public interface ICategoryRepository
{
    List<Category> GetAllCategories();
}