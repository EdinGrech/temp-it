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
import { connectionRefuse } from '../state/global/global.actions';

@Injectable()
export class HttpErrorsInterceptor implements HttpInterceptor {

  constructor(public store: Store<{global: any}>) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle connection refused error
        if (error.status === 0) {
          this.store.dispatch(connectionRefuse({ error }));
          return throwError('Connection refused. Please check your internet connection.');
        }
        return throwError(error);
      })
    );
  }
  }
