using Core.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess_SQLite;

public class MainDbContext: DbContext
{
  public MainDbContext(DbContextOptions<MainDbContext> options): base(options)
  {
    
  }
  public virtual DbSet<Organisation> Organisation { get; set; }
  public virtual DbSet<Category> Category { get; set; }
  public virtual DbSet<User> User { get; set; }
  public virtual DbSet<Event> Event { get; set; }
  public virtual DbSet<Ticket> Ticket { get; set; }
  public virtual DbSet<Role> Roles { get; set; }
  public virtual DbSet<Permission> Permissions { get; set; }
  
  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<Organisation>()
      .HasOne(o => o.Category)
      .WithMany();

    modelBuilder.Entity<Organisation>()
      .HasOne(o => o.Owner)
      .WithMany();

    modelBuilder.Entity<Organisation>()
      .HasMany(o => o.Roles)
      .WithOne(r => r.Organisation);

    modelBuilder.Entity<Event>()
      .HasOne(e => e.Organisation)
      .WithMany(o => o.Events);

    modelBuilder.Entity<Event>()
      .HasMany(e => e.Tickets)
      .WithOne();

    modelBuilder.Entity<Role>()
      .HasMany(r => r.Permissions)
      .WithMany();

    modelBuilder.Entity<User>()
      .HasMany(u => u.Roles)
      .WithMany(r => r.Users);
  }
  
  protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
  {
    optionsBuilder.EnableSensitiveDataLogging();
  }
}