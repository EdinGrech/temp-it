import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth/auth.service';
import { TokenDealerService } from '../services/token-dealer/token-dealer.service';
@Injectable()
export class HttpErrorsInterceptor implements HttpInterceptor {

  constructor(
    public store: Store<{global: any}>,
    private cookieService: CookieService,
    private router: Router,
    private authService:AuthService,
    private tokenService: TokenDealerService) {}

  intercept(request: HttpRequest<HttpErrorResponse>, next: HttpHandler): Observable<HttpEvent<HttpErrorResponse>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle connection refused error
        if (error.status == 0) {
          error.error.error = 'No connection to server.';
        } else if ((error.status === 401 && !this.tokenService.isRefreshTokenExpired()) || error.status === 443) {
          this.cookieService.deleteAll();
          if (this.router.url != '/auth') this.router.navigate(['/auth']);
        } else if (error.status === 401 && this.tokenService.isRefreshTokenExpired()) {
          this.authService.refreshToken().subscribe((response: any) => {
            if(response.status == 443){
              this.cookieService.deleteAll();
              if (this.router.url != '/auth') this.router.navigate(['/auth']);
              return throwError(error);
            } else {
              //handel request with new cookie value
              request = request.clone({
                setHeaders: {
                  "Authorization": `Bearer ${this.cookieService.get('access')}`,
                }
              });
              return next.handle(request);
            }
          });
        }
        return throwError(error);
      })
    );
  }
  }
