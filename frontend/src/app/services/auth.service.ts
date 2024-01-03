import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StringConstants } from '../constants/stringConstants';
import { LoginDTO } from '../interfaces/dtos/auth/loginDTO';
import { RegisterDTO } from '../interfaces/dtos/auth/registerDTO';
import { UserModel } from '../interfaces/userModel';
import { ServerURLs } from '../constants/serverURLs';
import jwt_decode from 'jwt-decode';
import {TokenPayload} from "../stores/api-stores/user.store";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public http: HttpClient
  ) { }

  login(loginDTO: LoginDTO): Observable<string> {
    return this.http.post(ServerURLs.AUTH_LOGIN, loginDTO, { responseType: 'text', withCredentials: true });
  }

  register(registerDTO: RegisterDTO): Observable<UserModel> {
    return this.http.post<UserModel>(ServerURLs.AUTH_REGISTER, registerDTO);
  }

  refreshToken(userId: number): Observable<string> {
    return this.http.get(ServerURLs.AUTH_REFRESH_TOKEN + userId, { responseType: 'text', withCredentials: true });
  }

  logout() {
    return this.http.post(ServerURLs.AUTH_LOGOUT, {}, { withCredentials: true });
  }

  saveToken(token: string) {
    const tokenPayload: TokenPayload = jwt_decode(token);
    localStorage.setItem(StringConstants.ACCESS_TOKEN, token);
    localStorage.setItem(StringConstants.TOKEN_EXPIRY_DATE, tokenPayload.exp.toString());
  }

  removeToken() {
    localStorage.removeItem(StringConstants.ACCESS_TOKEN);
    localStorage.removeItem(StringConstants.TOKEN_EXPIRY_DATE);
  }

  signInWithGoogle(credentials: any): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.post(ServerURLs.AUTH_LOGIN_GOOGLE, JSON.stringify(credentials), { responseType: 'text', headers: header, withCredentials: true });
  }

  loginWithFacebook(credentials: any): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.post(ServerURLs.AUTH_LOGIN_FACEBOOK, JSON.stringify(credentials), { responseType: 'text', headers: header, withCredentials: true });
  }
}
