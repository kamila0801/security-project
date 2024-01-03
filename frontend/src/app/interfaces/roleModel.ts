import {PermissionModel} from "./permissionModel";

export interface RoleModel {
  id: number,
  name: string,
  organisationId: number,
  hierarchyLevel: number,
  permissions: PermissionModel[]
}
