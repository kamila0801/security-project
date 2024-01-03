using FluentValidation;
using MainAPI.Dtos;

namespace MainAPI.SecurityDto;

public class CreateUserDto
{
  public string FirstName { get; set; }
  public string LastName { get; set; }
  public string Email { get; set; }
  public string Password { get; set; }
}

public class CreateUserDtoValidator : AbstractValidator<CreateUserDto>
{
  public CreateUserDtoValidator()
  {
    RuleFor(u => u.Email)
      .NotEmpty().WithMessage("Email cannot be empty");
    RuleFor(u => u.Password)
      .NotEmpty().WithMessage("Password cannot be empty");
    RuleFor(u => u.Email)
      .EmailAddress().WithMessage("Email address must follow an email pattern");
    RuleFor(u => u.Password)
      .Matches(@"^(?=.*[A-Z])(?=.*\d).{8,}$")
      .WithMessage("Password must be at least 8 characters long, contain one capital letter, and one number.");
  }
}