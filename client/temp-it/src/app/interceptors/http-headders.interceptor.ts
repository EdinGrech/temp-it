import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class HttpHeaddersInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwtToken = this.cookieService.get('jwt');
    // if (jwtToken !== undefined) {
    //   request = request.clone({
    //     setHeaders: {
    //       'Authorization': `Bearer ${jwtToken}`,
    //     }
    //   });
    // }
    return next.handle(request);
  }
}
