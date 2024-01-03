using Core.Constants;
using Core.IServices;
using Core.Models;
using Domain.IRepositories;
using Microsoft.AspNetCore.Http;

namespace Domain.Services;

public class OrganisationService : IOrganisationService
{
    private readonly IOrganisationRepository _repo;
    private readonly IFileService _fileService;
    private readonly IUserService _userService;
    private readonly IPermissionRepository _permissionRepository;
    private readonly IRoleRepository _roleRepository;

    public OrganisationService(IOrganisationRepository repository, IFileService fileService, IUserService userService, IPermissionRepository permissionRepository, IRoleRepository roleRepository)
    {
        _repo = repository;
        _fileService = fileService;
        _userService = userService;
        _permissionRepository = permissionRepository;
        _roleRepository = roleRepository;
    }

    public PagedResult<Organisation> GetAllOrganisations(OrganisationsFilter filter)
    {
        return _repo.GetAllOrganisations(filter);
    }

    public Organisation GetOrganisation(int id)
    {
        return _repo.GetOrganisation(id);
    }

    // TODO: make transactional
    public async Task<Organisation> CreateOrganisation(Organisation newOrganisation, IFormFile file)
    {
        //create organisation
        var created = await _repo.CreateOrganisation(newOrganisation);
        //create owner role
        var allPermissions = await _permissionRepository.GetAll();
        var ownerRole = new Role()
        {
            Name = "Owner", HierarchyLevel = 0, Permissions = allPermissions, Users = new List<User>(){ newOrganisation.Owner }, Organisation = created
        };
        var newRole = await _roleRepository.Create(ownerRole);

        var fileName = "logo-" + created.Id;
        try
        {
            await _fileService.UploadFile(file, fileName, StorageBuckets.ORGANISATION_LOGO);
            created.ImageUrl = fileName;
            await UpdateOrganisation(created);
        }
        catch (Exception e)
        {
            Console.WriteLine("Could not upload file");
            Console.WriteLine(e);
            throw new Exception("Could not upload file: " + e.Message);
        }
        
        return created;
    }

    public async Task<Organisation> UpdateOrganisation(Organisation organisation)
    {
        return await _repo.UpdateOrganisation(organisation);
    }

}