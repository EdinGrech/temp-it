import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpHeaddersInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (request.url.includes(environment.motherShipUrl)) {
      if (localStorage.getItem('access')) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        });
      }
    }
    return next.handle(request);
  }
}
