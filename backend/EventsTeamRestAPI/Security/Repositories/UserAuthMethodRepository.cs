using Security.Enums;
using Security.IRepositories;
using Security.Models;

namespace Security.Repositories;

public class UserAuthMethodRepository: IUserAuthMethodRepository
{
    private AuthDbContext _ctx;
    
    public UserAuthMethodRepository(AuthDbContext ctx)
    {
        {
            if (ctx == null)
            {
                throw new InvalidDataException("DbContext cannot be null");
            }
            _ctx = ctx;
        }
    }
    
    
    public AuthMethod? FindByExtIdAndProvider(string extUserId, AuthProvider provider)
    {
        var authMethod = _ctx.AuthMethods.FirstOrDefault(authMethod =>
            authMethod.ExternalUserId == extUserId && authMethod.Provider == provider);
        return authMethod ?? null;
    }

    public AuthMethod? FindByEmailAndProvider(string email, AuthProvider provider)
    {
        var authMethod = _ctx.AuthMethods.FirstOrDefault(authMethod =>
            authMethod.Email == email && authMethod.Provider == provider);
        return authMethod ?? null;
    }


    public AuthMethod CreateAuthMethod(AuthMethod authMethod)
    {
        _ctx.AuthMethods.Add(authMethod);
        _ctx.SaveChanges();

        return authMethod;
    }

    public AuthMethod FindById(int? id)
    {
        var authMethod = _ctx.AuthMethods.FirstOrDefault(authMethod =>
            authMethod.Id == id);
        return authMethod ?? null;
    }
}