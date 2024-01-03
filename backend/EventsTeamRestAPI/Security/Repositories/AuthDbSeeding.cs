using Security.IServices;

namespace Security.Repositories;

public class AuthDbSeeding
{
  private  AuthDbContext _ctx;
  private  ISecurityService _securityService;

  public AuthDbSeeding(AuthDbContext ctx, ISecurityService securityService)
  {
    _ctx = ctx;
    _securityService = securityService;
  }

  public void SeedAuthDevelopment()
  {
    _ctx.Database.EnsureDeleted();
    _ctx.Database.EnsureCreated();
  }
}