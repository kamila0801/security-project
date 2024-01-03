using FluentValidation;

namespace MainAPI.Dtos.Role;

public class CreateRoleDto
{
    public string Name { get; set; }
    public int OrganisationId { get; set; }
    public int HierarchyLevel { get; set; } // 0 is highest
    public List<int> PermissionIds { get; set; } 
    public List<int> UserIds { get; set; } 
}

public class CreateRoleDtoValidator : AbstractValidator<CreateRoleDto>
{
    public CreateRoleDtoValidator()
    {
        RuleFor(r => r.Name)
            .NotEmpty().WithMessage("Name cannot be empty");
        RuleFor(r => r.HierarchyLevel)
            .GreaterThanOrEqualTo(0).WithMessage("Hierarchy level must be a number greater or equal to 0");
        RuleFor(r => r.PermissionIds)
            .NotEmpty().WithMessage("Role must have permissions!");
        RuleFor(r => r.UserIds)
            .NotEmpty().WithMessage("Role must have users!");
    }
}