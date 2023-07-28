import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class GrapherService {

  constructor(private http: HttpClient) { }

    get24HoursTempHumData(): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      };
      return this.http.get<any>(`${environment.motherShipUrl}/temp-hum/24-hours`,httpOptions).pipe(
        catchError((error: HttpErrorResponse) => {
        return throwError(error);
      }));
  }
}
