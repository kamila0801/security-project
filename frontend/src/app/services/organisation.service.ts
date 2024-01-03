import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerURLs } from '../constants/serverURLs';
import { OrganisationModel } from '../interfaces/organisationModel';
import { PagedResultDTO } from '../interfaces/dtos/pagedResultDTO';
import { StringConstants } from '../constants/stringConstants';

@Injectable({
  providedIn: 'root'
})
export class OrganisationService {

  constructor(
    public http: HttpClient
  ) { }

  create(formData: FormData): Observable<OrganisationModel> {
    return this.http.post<OrganisationModel>(ServerURLs.ORGANISATION_CREATE, formData);
  }

  getAll(skip: number, take: number, sortBy: string, categoryId?: number): Observable<PagedResultDTO<OrganisationModel>> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append(StringConstants.SORT_BY, sortBy);
    if(categoryId) queryParams = queryParams.append(StringConstants.CATEGORY_ID, categoryId);
    return this.http.get<PagedResultDTO<OrganisationModel>>(ServerURLs.ORGANISATION_GET_ALL + skip + "/" + take, { params: queryParams });
  }

  getById(id: number): Observable<OrganisationModel> {
    return this.http.get<OrganisationModel>(ServerURLs.ORGANISATION_GET_BY_ID + id);
  }
}
