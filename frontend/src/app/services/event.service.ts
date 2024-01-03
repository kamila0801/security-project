import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerURLs } from '../constants/serverURLs';
import { EventModel } from '../interfaces/eventModel';
import { PagedResultDTO } from '../interfaces/dtos/pagedResultDTO';
import { StringConstants } from '../constants/stringConstants';
import {EventsFilters} from "../interfaces/filters/eventsFilters";
import {DateRange} from "@angular/material/datepicker";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    public http: HttpClient
  ) { }

  getAll(skip: number, take: number, filter: EventsFilters): Observable<PagedResultDTO<EventModel>>{

    let queryParams = new HttpParams();
    const sortBy = filter.sortBy;
    const sortOrder = filter.sortOrder;
    const categoryId = filter.category?.map(cat => cat.id).join(',');
    const textSearch = filter.textSearch;
    const minPrice = filter.minPrice;
    const maxPrice = filter.maxPrice;
    const date = filter.date;

    if (sortBy) queryParams = queryParams.append(StringConstants.SORT_BY, sortBy);
    if (sortOrder) queryParams = queryParams.append(StringConstants.SORT_ORDER, sortOrder);
    if (categoryId) queryParams = queryParams.append(StringConstants.CATEGORY_ID, categoryId);
    if (textSearch) queryParams = queryParams.append(StringConstants.TEXT_SEARCH, textSearch);
    if (minPrice) queryParams = queryParams.append(StringConstants.MIN_PRICE, minPrice);
    if (maxPrice) queryParams = queryParams.append(StringConstants.MAX_PRICE, maxPrice);
    if (date && date instanceof Date) queryParams = queryParams.append(StringConstants.DATE, date.toDateString());
    else if (date && date.start && date.end) {
      queryParams = queryParams.append(StringConstants.START_DATE, date.start.toDateString());
      queryParams = queryParams.append(StringConstants.END_DATE, date.end.toDateString());
    }

    return this.http.get<PagedResultDTO<EventModel>>(ServerURLs.EVENT_GET_ALL + skip + "/" + take, { params: queryParams });
  }

  getByOrganisation(organisationId: number, sortBy: string): Observable<EventModel[]>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append(StringConstants.SORT_BY, sortBy);
    return this.http.get<EventModel[]>(ServerURLs.EVENT_GET_ALL + organisationId, { params: queryParams });
  }

  create(formData: FormData): Observable<EventModel>{
    return this.http.post<EventModel>(ServerURLs.EVENT_CREATE, formData);
  }
}
