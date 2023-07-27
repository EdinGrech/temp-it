import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { globalError } from '../state/global/global.actions';

import { CookieService } from 'ngx-cookie-service';
@Injectable()
export class HttpErrorsInterceptor implements HttpInterceptor {

  constructor(
    public store: Store<{global: any}>,
    private cookieService: CookieService,) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle connection refused error
        if (error.status === 0) {
          this.store.dispatch(globalError({ error }));
          return throwError('Connection refused. Please check your internet connection.');
        } else if (error.status === 401) {
          // Handle 401 error
          this.store.dispatch(globalError({ error }));
          this.cookieService.delete('jwt');
          return throwError('Unauthorized');
        }
        return throwError(error);
      })
    );
  }
  }
