using FluentValidation;

namespace MainAPI.Dtos;

public class CreateOrganisationDTO
{
    public string Name { get; set; }
    public string? Tagline { get; set; }
    public string Description { get; set; }
    public string Address { get; set; }
    public int PostCode { get; set; }
    public string City { get; set; }
    public int PhoneNumber { get; set; }
    public string Email { get; set; }
    public int CategoryId { get; set; }
    public int OwnerId { get; set; }
    public int? RegNumber { get; set; }
    public int? AccountNumber { get; set; }
    public string ColorHex { get; set; }
    public IFormFile File { get; set; }
}

public class CreateOrganisationDtoValidator : AbstractValidator<CreateOrganisationDTO>
{
    public CreateOrganisationDtoValidator()
    {
        RuleFor(o => o.Name)
            .NotEmpty().WithMessage("Name cannot be empty");
        RuleFor(o => o.Address)
            .NotEmpty().WithMessage("Address cannot be empty");
        RuleFor(o => o.PostCode.ToString())
            .Length(4, 4).WithMessage("Post code must be a 4 digit number");
        RuleFor(o => o.City)
            .NotEmpty().WithMessage("City cannot be empty");
        RuleFor(o => o.CategoryId)
            .GreaterThanOrEqualTo(0).WithMessage("Invalid category id");
        RuleFor(o => o.OwnerId)
            .GreaterThanOrEqualTo(0).WithMessage("Invalid owner id");
        RuleFor(o => o.Tagline)
            .MaximumLength(255).WithMessage("Tagline cannot be longer than 255 characters");
        When(o => o.PhoneNumber > 0, () =>
        {
            RuleFor(o => o.PhoneNumber.ToString())
                .Length(8, 8).WithMessage("Phone number must have 8 digits");
        });
        When(o => !string.IsNullOrEmpty(o.Email), () =>
        {
            RuleFor(o => o.Email)
                .EmailAddress().WithMessage("Email address must follow an email pattern");
        });
        When(o => o.RegNumber != null, () =>
        {
            RuleFor(o => o.RegNumber.ToString())
                .Length(4, 4).WithMessage("Reg number must be 4 digits");
        });
        When(o => o.AccountNumber != null, () =>
        {
            RuleFor(o => o.AccountNumber.ToString())
                .Length(10, 10).WithMessage("Account number must be 10 digits");
        });
    }
}