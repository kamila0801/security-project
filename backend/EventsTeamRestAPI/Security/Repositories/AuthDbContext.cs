using Microsoft.EntityFrameworkCore;
using Security.Entities;
using Security.Models;

namespace Security.Repositories;

public class AuthDbContext: DbContext
{
  public AuthDbContext(DbContextOptions<AuthDbContext> options) :base(options)
  {
      
  }

  public DbSet<LoginUserEntity> LoginUsers { get; set; }
  public DbSet<AuthMethod> AuthMethods { get; set; }
}