using Core.Models;

namespace Domain.IRepositories;

public interface IOrganisationRepository
{
    PagedResult<Organisation> GetAllOrganisations(OrganisationsFilter filter);
    Task<Organisation> CreateOrganisation(Organisation organisation);
    Task<Organisation> UpdateOrganisation(Organisation organisation);
    Organisation GetOrganisation(int id);
}