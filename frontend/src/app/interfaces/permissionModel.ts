export interface PermissionModel {
  id: number,
  name: PermissionEnums
}

export enum PermissionEnums {
  EVENT_CREATE ="EVENT_CREATE",
  EVENT_UPDATE = "EVENT_UPDATE",
  EVENT_DELETE = "EVENT_DELETE",
  ROLE_CREATE = "ROLE_CREATE",
  ROLE_UPDATE = "ROLE_UPDATE",
  ROLE_DELETE = "ROLE_DELETE",
  ORGANISATION_UPDATE = "ORGANISATION_UPDATE",
  ORGANISATION_DELETE = "ORGANISATION_DELETE"
}
