import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {ServerURLs} from "../constants/serverURLs";
import {HttpClient} from "@angular/common/http";
import {RoleModel} from "../interfaces/roleModel";
import {RoleInOrganisationDTO} from "../interfaces/dtos/roleInOrganisationDTO";

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    private http: HttpClient
  ) { }

  getRoleByUserInOrganisation(userId: number, organisationId: number): Observable<RoleModel> {
    return this.http.get<RoleModel>(ServerURLs.ROLE_GET_BY_USER_AND_ORG + userId + '/' + organisationId);
  }

  getAllRolesInOrganisation(organisationId: number): Observable<RoleInOrganisationDTO[]> {
    return this.http.get<RoleInOrganisationDTO[]>(ServerURLs.ROLE_GET_ALL_BY_ORG + organisationId);
  }
}
