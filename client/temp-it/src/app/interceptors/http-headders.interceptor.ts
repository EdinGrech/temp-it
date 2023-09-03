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
    //if request is to the mother ship, add jwt token to the request
    if (request.url.includes(environment.motherShipUrl)) {
      const jwtToken = this.cookieService.get('jwt');
      if (jwtToken) {
        request = request.clone({
          setHeaders: {
            'Authorization': `Bearer ${jwtToken}`,
          }
        });
      }
    }
    return next.handle(request);
  }
}
