using Core.Constants;
using Core.Exceptions;
using Core.Models;
using Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace DataAccess_SQLite.Repositories;

public class OrganisationRepository : IOrganisationRepository
{
    
    private readonly MainDbContext _ctx;

    public OrganisationRepository(MainDbContext ctx)
    {
        _ctx = ctx;
    }

    public PagedResult<Organisation> GetAllOrganisations(OrganisationsFilter filter)
    {
        var statement = _ctx.Organisation
            .Include(o => o.Category)
            .Include(o => o.Owner)
            .Select(org => org);
        
        if (!filter.CategoryId.IsNullOrEmpty())
            statement = statement.Where(o => filter.CategoryId.Contains(o.Category.Id));
        
        if (!string.IsNullOrEmpty(filter.TextSearch))
        {
            statement = statement.Where(o => 
                o.Name.ToLower().Contains(filter.TextSearch.ToLower())
                || o.Description.ToLower().Contains(filter.TextSearch.ToLower())
                || o.Tagline.ToLower().Contains(filter.TextSearch.ToLower()));
        }
        
        if (!string.IsNullOrEmpty(filter.SortBy))
        {
            if (filter.SortOrder == SortingOrderEnum.DESC)
            {
                statement = filter.SortBy switch
                {
                    SortingEnum.NAME => statement.OrderByDescending(e => e.Name),
                    SortingEnum.CITY => statement.OrderByDescending(e => e.City),

                    _ => statement
                };
            }
            else if (filter.SortOrder == SortingOrderEnum.ASC)
            {
                statement = filter.SortBy switch
                {
                    SortingEnum.NAME => statement.OrderBy(e => e.Name),
                    SortingEnum.CITY => statement.OrderBy(e => e.City),
                    _ => statement
                };
            }
        }

        var totalCount = statement.Count();
        statement = statement.Skip(filter.Skip).Take(filter.Take);

        return new PagedResult<Organisation> {Data = statement.ToList(), Total = totalCount};
    }

    public Organisation GetOrganisation(int id)
    {
        var org = _ctx.Organisation
            .Include(o => o.Category)
            .Include(o => o.Owner)
            .Where(o => o.Id == id)
            .Select(org => org)
            .FirstOrDefault();
        if (org == null)
            throw new ResourceNotFoundException("No organisation with that id found", "id: " + id);
        return org;
    }

    public async Task<Organisation> CreateOrganisation(Organisation organisation)
    {
        organisation = await ValidateAndAssignRelations(organisation);
        var createdOrg = _ctx.Add(organisation).Entity;
        await _ctx.SaveChangesAsync();
        return createdOrg;
    }

    public async Task<Organisation> UpdateOrganisation(Organisation organisation)
    {
        organisation = await ValidateAndAssignRelations(organisation);
        _ctx.Attach(organisation).State = EntityState.Modified;
        await _ctx.SaveChangesAsync();
        return organisation;
    }

    private async Task<Organisation> ValidateAndAssignRelations(Organisation organisation)
    {
        var fetchCategory = _ctx.Category.FirstOrDefaultAsync(c => c.Id == organisation.Category.Id);
        var fetchOwner = _ctx.User.FirstOrDefaultAsync(u => u.Id == organisation.Owner.Id);

        await Task.WhenAll(fetchCategory, fetchOwner);
        Category? category = fetchCategory.Result;
        User? owner = fetchOwner.Result;

        if (category == null)
            throw new ResourceNotFoundException("Incorrect category id: category with this id doesn't exist.", "categoryId");
        if (owner == null)
            throw new ResourceNotFoundException("Incorrect owner id: User with this id doesn't exist.", "ownerId");
            
        organisation.Category = category;
        organisation.Owner = owner;

        return organisation;
    }
}