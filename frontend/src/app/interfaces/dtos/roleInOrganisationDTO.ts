import {PermissionModel} from "../permissionModel";

export interface RoleInOrganisationDTO {
  id: number,
  name: string,
  hierarchyLevel: number,
  permissions: PermissionModel[]
  users: SimpleUserDTO[]
}

export interface SimpleUserDTO {
  id: number,
  fullName: string
}
