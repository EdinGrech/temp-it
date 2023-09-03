import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EspSetupService {
  constructor(private http: HttpClient) {}

  testConnection(): Observable<string> {
    return this.http
      .get<{status:string}>(environment.esp32Url + '/getit')
      .pipe(map((response: {status:string}) => response.status));
  }

  setWifi(pin: number, ssid: string, password: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(environment.esp32Url + '/', {
      pin: pin,
      ssid: ssid,
      password: password,
      server_url: environment.motherShipUrl,
      server_port: environment.apiPort,
    }, {headers: headers});
  }
}
