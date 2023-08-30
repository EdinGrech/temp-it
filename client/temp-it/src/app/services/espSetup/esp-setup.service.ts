import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EspSetupService {
  constructor(private http: HttpClient) {}

  testConnection(): Observable<boolean> {
    return this.http
      .get<boolean>(environment.esp32Url + '/getit', {})
      .pipe(map((response: boolean) => response));
  }

  setWifi(pin: number, ssid: string, password: string) {
    return this.http.post(environment.esp32Url + '/', {
      pin: pin,
      ssid: ssid,
      password: password,
      server_url: environment.motherShipUrl,
      server_port: environment.apiPort,
    });
  }
}
