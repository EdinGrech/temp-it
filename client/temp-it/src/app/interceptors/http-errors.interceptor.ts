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
import { Router } from '@angular/router';
@Injectable()
export class HttpErrorsInterceptor implements HttpInterceptor {

  constructor(
    public store: Store<{global: any}>,
    private cookieService: CookieService,
    private router: Router) {}

  intercept(request: HttpRequest<HttpErrorResponse>, next: HttpHandler): Observable<HttpEvent<HttpErrorResponse>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle connection refused error
        if (error.status == 0) {
          error.error.error = 'No connection to server.';
        } else if (error.status === 401) {
          this.cookieService.delete('jwt');
          this.router.navigate(['/auth']);
        }
        return throwError(error);
      })
    );
  }
  }
