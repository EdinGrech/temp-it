import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User, UserSignUpResponse } from 'src/app/interfaces/user';

import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) {}

  signUp(
    username: string,
    email: string,
    password: string,
  ): Observable<UserSignUpResponse> {
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
    this.cookieService.delete('jwt');
    return this.http.post<UserSignUpResponse>(
      environment.motherShipUrl +
        ':' +
        environment.apiPort +
        '/api/auth/register/',
      body,
      httpOptions,
    );
  }

  signInWithEmail(email: string, password: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    const body = {
      emailOrUsername: email,
      password: password,
    };
    this.cookieService.delete('jwt');
    return this.http
      .post<any>(
        environment.motherShipUrl +
          ':' +
          environment.apiPort +
          '/api/auth/login/',
        body,
        httpOptions,
      )
      .pipe(
        map((response: any) => {
          this.cookieService.set('jwt', response['token']);
          return response;
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
    return this.http.post<any>(environment.motherShipUrl + ':' + environment.apiPort + '/api/auth/forgot-password/', body, httpOptions);
  }

  logout() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    this.cookieService.delete('jwt');
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
        Authorization: 'Bearer ' + this.cookieService.get('jwt'),
      }),
    };
    return this.http.get<User>(
      environment.motherShipUrl +
        ':' +
        environment.apiPort +
        '/api/auth/profile/',
      httpOptions,
    );
  }

  //not implimented on server yet
  updateUser(user: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.cookieService.get('jwt'),
      }),
    };
    const body = {
      username: user.username,
      email: user.email,
    };
    return this.http.put<User>(
      environment.motherShipUrl +
        ':' +
        environment.apiPort +
        '/api/auth/update/',
      body,
      httpOptions,
    );
  }
}
