import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SensorDetails, SensorDetailsUpdatable, singleSensorData } from 'src/app/interfaces/sensor/sensor';
import { HttpResponse } from '@capacitor/core';
@Injectable({
  providedIn: 'root'
})
export class SensorService {

  constructor(private http: HttpClient,) { }

  getSensorDetails(id:number):Observable<SensorDetails>{
    return this.http.get<SensorDetails>(
      environment.motherShipUrl +
        ':' +
        environment.apiPort +
        '/api/temp/sensor-details/' + id
    )
  }

  updateSensorDetails(sensorDetails: SensorDetailsUpdatable):Observable<HttpResponse>{

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    
    return this.http.put<HttpResponse>(
      environment.motherShipUrl +
        ':' +
        environment.apiPort +
        '/api/temp/sensor-details/' + sensorDetails.id + '/update',
        sensorDetails.updatable, httpOptions
    )
  }

  getSensorLast24Hours(id:number):Observable<singleSensorData[]>{
    return this.http.get<singleSensorData[]>(
      environment.motherShipUrl +
        ':' +
        environment.apiPort +
        '/api/temp/sensor/' + id
    )
  }

  getUserSensors():Observable<SensorDetails[]>{
    return this.http.get<SensorDetails[]>(
      environment.motherShipUrl +
        ':' +
        environment.apiPort +
        '/api/temp/my-sensors'
    )
  }

  getUserSensorsCount():Observable<number>{
    return this.http.get<number>(
      environment.motherShipUrl +
        ':' +
        environment.apiPort +
        '/api/temp/my-sensors-count'
    )
  }

  getUserSensorDataCustomRange(startDate:number, endDate:number, id:number):Observable<singleSensorData[]>{
    const body = {
      startDate: startDate,
      endDate: endDate
    }
    
    return this.http.post<singleSensorData[]>(
      environment.motherShipUrl +
        ':' +
        environment.apiPort +
        '/api/temp/sensor/date-range/' + id, body
    )
  }
}
