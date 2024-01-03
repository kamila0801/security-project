using Security.Enums;
using Security.Models;

namespace Security.IRepositories;

public interface IUserAuthMethodRepository
{
    AuthMethod? FindByExtIdAndProvider(string extUserId, AuthProvider provider);

    // Find user auth method by email and provider
    AuthMethod? FindByEmailAndProvider(string email, AuthProvider provider);

    // Create a new auth method
    AuthMethod CreateAuthMethod(AuthMethod authMethod);
    AuthMethod FindById(int? id);
}