import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ServerURLs} from '../../constants/serverURLs';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {

  constructor(
    public http: HttpClient,
  ) { }

  signInWithGoogle(credentials: any): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.post(ServerURLs.AUTH_LOGIN_GOOGLE, JSON.stringify(credentials), { responseType: 'text', headers: header, withCredentials: true });
  }

  loginWithFacebook(credentials: any): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.post(ServerURLs.AUTH_LOGIN_FACEBOOK, JSON.stringify(credentials), { responseType: 'text', headers: header, withCredentials: true });
  }
}
