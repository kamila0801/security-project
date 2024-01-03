using Core.Models;
using Microsoft.AspNetCore.Http;

namespace Core.IServices;

public interface IOrganisationService
{
    PagedResult<Organisation> GetAllOrganisations(OrganisationsFilter filter);
    Task<Organisation> CreateOrganisation(Organisation newOrganisation, IFormFile file);
    Task<Organisation> UpdateOrganisation(Organisation organisation);
    Organisation GetOrganisation(int id);
}