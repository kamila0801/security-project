using System.Text;
using Core.Exceptions;
using Core.IServices;
using DataAccess_SQLite;
using DataAccess_SQLite.Repositories;
using Domain.IRepositories;
using Domain.Services;
using MainAPI.OuthHandlers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using MainAPI.Controllers;
using MainAPI.Dtos;
using MainAPI.Dtos.Event;
using MainAPI.Dtos.Role;
using MainAPI.SecurityDto;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Security.IRepositories;
using Security.IServices;
using Security.Repositories;
using Security.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
  c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
  {
    Name = "Authorization",
    Type = SecuritySchemeType.Http,
    Scheme = "Bearer",
    BearerFormat = "JWT",
    In = ParameterLocation.Header,
    Description = "JWT Authorization header using the Bearer scheme."
  });

  c.AddSecurityRequirement(new OpenApiSecurityRequirement
  {
    {
      new OpenApiSecurityScheme
      {
        Reference = new OpenApiReference
        {
          Type = ReferenceType.SecurityScheme,
          Id = "Bearer"
        }
      },
      new string[] { }
    }
  });

  c.SwaggerDoc("v1", new OpenApiInfo
  {
    Title = "My API",
    Version = "v1"
  });
});

// CORS config

builder.Services.AddCors(option =>
{
  option.AddPolicy("eventsTeam-development",
    builder =>
    {
      builder.WithOrigins("http://localhost:4200", "https://localhost:4200")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// Dependency Injection
builder.Services.AddScoped<IOrganisationService, OrganisationService>();
builder.Services.AddScoped<IOrganisationRepository, OrganisationRepository>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<CreateOrganisationDtoValidator, CreateOrganisationDtoValidator>();
builder.Services.AddScoped<CreateEventDtoValidator, CreateEventDtoValidator>();
builder.Services.AddScoped<CreateUserDtoValidator, CreateUserDtoValidator>();
builder.Services.AddScoped<CreateRoleDtoValidator, CreateRoleDtoValidator>();
builder.Services.AddScoped<DtoConverter, DtoConverter>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IPermissionRepository, PermissionRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IPermissionValidator, PermissionValidator>();

// Dependency Injection Security
builder.Services.AddScoped<ISecurityService, SecurityService>();
builder.Services.AddScoped<IAuthUserService, AuthUserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserAuthMethodRepository, UserAuthMethodRepository>();
builder.Services.AddScoped<GoogleOAuthEventsHandler>();
builder.Services.AddHttpClient();

//Logger factory
var loggerFactory = LoggerFactory.Create(builder =>
{
  builder.AddConsole();
});

//Database init setup SQLite
builder.Services.AddDbContext<MainDbContext>(
  opt =>
  {
    opt
      .UseLoggerFactory(loggerFactory)
      .UseSqlite("Data Source=EventsTeam.db");
  }, ServiceLifetime.Transient);

// Auth Database init setup SQLite
builder.Services.AddDbContext<AuthDbContext>(
  opt =>
  {
    opt
      .UseLoggerFactory(loggerFactory)
      .UseSqlite("Data Source=EventsTeamSecurity.db");
  }, ServiceLifetime.Transient);


builder.Services.AddAuthentication(authentificationOptions =>
  {
    authentificationOptions.DefaultAuthenticateScheme =
      JwtBearerDefaults.AuthenticationScheme;
    authentificationOptions.DefaultChallengeScheme =
      JwtBearerDefaults.AuthenticationScheme;
  })
  .AddJwtBearer(options =>
  {
    options.TokenValidationParameters = new TokenValidationParameters
    {
      ValidateIssuerSigningKey = true,
      IssuerSigningKey =
        new SymmetricSecurityKey(
          Encoding.UTF8.GetBytes(builder.Configuration["jwtConfig:secret"])),
      ValidateIssuer = true,
      ValidIssuer = builder.Configuration["jwtConfig:issuer"],
      ValidateAudience = true,
      ValidAudience = builder.Configuration["jwtConfig:audience"]
    };
  });

builder.Services.AddControllers(options =>
{
  options.Filters.Add(typeof(ResourceNotFoundExceptionFilter));
});

builder.Services.AddTransient<DbSeeding>();
builder.Services.AddTransient<AuthDbSeeding>();
var app = builder.Build();

//DbSeeding

SeedAuthDevelopment(app);
SeedData(app);

void SeedAuthDevelopment(IHost app)
{
  var scopedFactory = app.Services.GetService<IServiceScopeFactory>();

  using (var scope = scopedFactory.CreateScope())
  {
    var service = scope.ServiceProvider.GetService<AuthDbSeeding>();
    service.SeedAuthDevelopment();
  }
}

void SeedData(IHost app)
{
  var scopedFactory = app.Services.GetService<IServiceScopeFactory>();

  using (var scope = scopedFactory.CreateScope())
  {
    var service = scope.ServiceProvider.GetService<DbSeeding>();
    service.SeedDevelopment();
  }
}

app.UseCors("eventsTeam-development");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.UseCors();

app.MapControllers();

app.Run();