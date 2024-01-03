import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerURLs } from '../constants/serverURLs';
import { UserModel } from '../interfaces/userModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  fetchUser(userId: number): Observable<UserModel> {
    return this.http.get<UserModel>(ServerURLs.USER_GET_BY_ID + userId);
  }

  updateUser(user: UserModel): Observable<UserModel> {
    return this.http.put<UserModel>(ServerURLs.USER_UPDATE, user);
  }
}
