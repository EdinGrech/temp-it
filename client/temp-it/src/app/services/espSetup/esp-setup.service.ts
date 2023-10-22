import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EspSetupService {
  constructor(private http: HttpClient) {}

  testConnection(): Observable<string> {
    return this.http
      .get<{ status: string }>(environment.esp32Url + '/getit')
      .pipe(map((response: { status: string }) => response.status));
  }

  setWifi(pin: number, ssid: string, password: string): Observable<boolean> {
    //remove http:// or https:// from environment.motherShipUrl
    const serverUrl = environment.espMotherShipUrl.replace(/(^\w+:|^)\/\//, '');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .post(
        environment.esp32Url + '/conf',
        {
          pin: pin.toString(),
          ssid: ssid,
          password: password,
          server_url: serverUrl,
          server_port: environment.apiPort,
        },
        { headers: headers },
      )
      .pipe(
        map((response: any) => {
          if (response && response.success) {
            return true;
          } else {
            return false;
          }
        }),
        take(1),
      );

    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    // });

    // const postData = {
    //   pin: 'your_pin_value',
    //   ssid: 'your_ssid',
    //   password: 'your_password',
    //   server_url: 'your_server_url',
    //   server_port: 'your_server_port',
    // };

    // this.http
    //   .post('http://192.168.42.1/conf', postData, { headers })
    //   .subscribe((data: any) => {
    //     console.log('Response from Arduino:', data);
    //   }, error => {
    //     console.error('Error sending POST request:', error);
    //   });
  }
}
