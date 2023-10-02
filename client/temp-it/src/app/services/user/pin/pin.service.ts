import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

interface PinResponse {
  pin: number;
}

@Injectable({
  providedIn: 'root',
})
export class PinService {
  constructor(private http: HttpClient) {}

  getUserPin(): Observable<number> {
    return this.http
      .post<PinResponse>(
        environment.motherShipUrl +
          ':' +
          environment.apiPort +
          '/api/auth/gen-pin/',
        {},
      )
      .pipe(map((response: PinResponse) => response.pin));
  }
}
