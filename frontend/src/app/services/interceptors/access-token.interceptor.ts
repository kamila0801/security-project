import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { StringConstants } from 'src/app/constants/stringConstants';
import { AuthService } from '../auth.service';
import {UserStore} from "../../stores/api-stores/user.store";

@Injectable()
export class AccessTokenInterceptor implements HttpInterceptor {

  private isRefreshing = false;

  constructor(
    private authService: AuthService,
    private userStore: UserStore
    ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token = this.getAccessToken();
    if(token) {
      request = this.appendTokenToRequest(request, token)
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      if (this.userStore.isLoggedIn) {
        return this.authService.refreshToken(this.userStore.user.data!.id).pipe(
          switchMap((res) => {
            this.isRefreshing = false;
            this.authService.saveToken(res);
            return next.handle(request);
          }),
          catchError((error) => {
            this.isRefreshing = false;
            this.userStore.logout();
            return throwError(() => error);
          })
        );
      }
    }

    return next.handle(request);
  }

  private getAccessToken(): string | null{
    return localStorage.getItem(StringConstants.ACCESS_TOKEN);
  }

  private isTokenExpired(): boolean {
    const expiryTimestamp = localStorage.getItem(StringConstants.TOKEN_EXPIRY_DATE);
    if(expiryTimestamp) {
      const expiryDate = new Date(parseInt(expiryTimestamp) * 1000);
      const now = new Date();
      if(expiryDate.getTime() - now.getTime() < 30000) return true;
    }
    return false;
  }

  private appendTokenToRequest(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    const requestWithToken = request.clone({
      url:  request.url,
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return requestWithToken;
  }
}

