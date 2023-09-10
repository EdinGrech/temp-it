import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { TokenDealerService } from '../services/token-dealer/token-dealer.service';
import { globalError } from '../state/global/global.actions';
@Injectable()
export class HttpErrorsInterceptor implements HttpInterceptor {

  constructor(
    public store: Store<{global: any}>,
    private router: Router,
    private authService:AuthService,
    private tokenService: TokenDealerService) {}

    intercept(
      request: HttpRequest<HttpErrorResponse>,
      next: HttpHandler
    ): Observable<HttpEvent<HttpErrorResponse>> {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          switch (error.status) {
            case 0:
              error.error.error = 'No connection to server.';
              this.store.dispatch(globalError({ error }));
              return throwError(error);
            case 401:
              if (this.tokenService.isRefreshTokenExpired()) {
                this.store.dispatch(globalError({ error }));
                this.tokenService.removeTokens();
                if (this.router.url != '/auth')
                  this.router.navigate(['/auth'], { replaceUrl: true });
                return throwError(error);
              } else if (this.tokenService.isAccessTokenExpired()) {
                if (this.tokenService.isRefreshing()) return this.reRunRequest(request, next);
                this.tokenService.setRefreshing(true);
                let thing = this.callRefresh(request, next, error);
                this.tokenService.setRefreshing(false);
                return thing;
              } else {
                this.store.dispatch(globalError({ error }));
                return throwError(error);
              }
            case 443:
              this.store.dispatch(globalError({ error }));
              this.tokenService.removeTokens();
              if (this.router.url != '/auth')
                this.router.navigate(['/auth'], { replaceUrl: true });
              return throwError(error);
            default:
              return throwError(error);
          }
        })
      );
    }
  
    callRefresh(
      request: HttpRequest<HttpErrorResponse>,
      next: HttpHandler,
      error: HttpErrorResponse
    ): Observable<HttpEvent<any>> {
      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          if (!response['access'] || !response['refresh']) {
            console.log('catch two and a half: ', response);
            this.tokenService.removeTokens();
            if (this.router.url != '/auth')
              this.router.navigate(['/auth'], { replaceUrl: true });
            return throwError(error);
          } else {
            return this.reRunRequest(request, next);
          }
        })
      );
    }

    reRunRequest(request: HttpRequest<HttpErrorResponse>, next: HttpHandler) {
      console.log(
        'catch three: ',
        request.headers.get('Authorization'),
        'cloning'
      );
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${localStorage.getItem('refresh')}`,
        },
      });
      console.log(request.headers.get('Authorization'));
      return next.handle(request);
    }
  }
