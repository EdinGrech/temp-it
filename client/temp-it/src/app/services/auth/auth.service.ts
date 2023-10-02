import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthTokens, RegisterResponse, User } from 'src/app/interfaces/user';

import { CookieService } from 'ngx-cookie-service';

import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    public store: Store<{ global: any }>,
  ) {}

  refreshToken() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    const body = {
      refresh: localStorage.getItem('refresh'),
    };
    return this.http
      .post<any>(
        environment.motherShipUrl +
          ':' +
          environment.apiPort +
          '/api/auth/token/refresh/',
        body,
        httpOptions,
      )
      .pipe(
        map((response: any) => {
          localStorage.setItem('access', response['access']);
          localStorage.setItem('refresh', response['refresh']);
          return response;
        }),
      );
  }

  signUp(
    username: string,
    email: string,
    password: string,
  ): Observable<RegisterResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    const body = {
      username: username,
      email: email,
      password: password,
    };
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    return this.http
      .post<RegisterResponse>(
        environment.motherShipUrl +
          ':' +
          environment.apiPort +
          '/api/auth/register/',
        body,
        httpOptions,
      )
      .pipe(
        catchError((error: any) => {
          return throwError(error);
        }),
      );
  }

  signInWithEmail(email: string, password: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    const body = {
      email: email,
      password: password,
    };
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    return this.http
      .post<AuthTokens>(
        environment.motherShipUrl +
          ':' +
          environment.apiPort +
          '/api/auth/login/',
        body,
        httpOptions,
      )
      .pipe(
        map((response: any) => {
          localStorage.setItem('access', response['access']);
          localStorage.setItem('refresh', response['refresh']);
          return response;
        }),
        catchError((error: any) => {
          return throwError(error);
        }),
      );
  }

  forgotPassword(email: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    const body = {
      email: email,
    };
    return this.http
      .post<any>(
        environment.motherShipUrl +
          ':' +
          environment.apiPort +
          '/api/auth/forgot-password/',
        body,
        httpOptions,
      )
      .pipe(
        catchError((error: any) => {
          return throwError(error);
        }),
      );
  }

  logout() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    return this.http.post<any>(
      environment.motherShipUrl +
        ':' +
        environment.apiPort +
        '/api/auth/logout/',
      {},
      httpOptions,
    );
  }

  getUser() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http
      .get<User>(
        environment.motherShipUrl +
          ':' +
          environment.apiPort +
          '/api/auth/profile/',
        httpOptions,
      )
      .pipe(
        catchError((error: any) => {
          return throwError(error);
        }),
      );
  }

  updateUser(user: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    const body = {
      username: user.username,
      email: user.email,
    };
    return this.http
      .put<User>(
        environment.motherShipUrl +
          ':' +
          environment.apiPort +
          '/api/auth/update/',
        body,
        httpOptions,
      )
      .pipe(
        catchError((error: any) => {
          return throwError(error);
        }),
      );
  }
}
