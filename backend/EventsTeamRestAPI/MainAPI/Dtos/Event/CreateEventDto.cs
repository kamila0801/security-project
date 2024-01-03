using FluentValidation;
using MainAPI.Dtos.Ticket;

namespace MainAPI.Dtos.Event;

public class CreateEventDto
{
    public int OrganisationId { get; set; }
    public string Name { get; set; }
    public string ShortDescription { get; set; }
    public string FullDescription { get; set; }
    public DateTime Date { get; set; }
    public List<CreateTicketDto> Tickets { get; set; }
    public string Address { get; set; }
    public int PostCode { get; set; }
    public string City { get; set; }
    public string ColorHex { get; set; }
    public IFormFile File { get; set; }
}

public class CreateEventDtoValidator : AbstractValidator<CreateEventDto>
{
    public CreateEventDtoValidator()
    {
        RuleFor(o => o.Name)
            .NotEmpty().WithMessage("Name cannot be empty");
        RuleFor(o => o.Address)
            .NotEmpty().WithMessage("Address cannot be empty");
        RuleFor(o => o.PostCode.ToString())
            .Length(4, 4).WithMessage("Post code must be a 4 digit number");
        RuleFor(o => o.City)
            .NotEmpty().WithMessage("City cannot be empty");
        RuleFor(o => o.OrganisationId)
            .GreaterThanOrEqualTo(0).WithMessage("Invalid organisation id");
    }
}