import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerURLs } from '../constants/serverURLs';
import {CategoryDTO} from "../interfaces/dtos/categoryDTO";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    public http: HttpClient
  ) { }

  getAll() : Observable<CategoryDTO[]>{
    return this.http.get<CategoryDTO[]>(ServerURLs.CATEGORY_GET_ALL);
  }
}
