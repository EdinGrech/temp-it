import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpHeaddersInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes(environment.motherShipUrl)) {
      if (this.cookieService.get('access')) {
        request = request.clone({
          setHeaders: {
            'Authorization': `Bearer ${this.cookieService.get('access')}`,
          }
        });
      }
    }
    return next.handle(request);
  }
}
