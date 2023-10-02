import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Group {
  "group_name": string,
  "group_description": string,
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) { }

  createGroup(groupData: Group): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post<any>(
      environment.motherShipUrl +
        ':' +
        environment.apiPort +
        '/api/group/create',
        groupData,
      httpOptions,
    );
  }

  gerGroups(): Observable<any> {
    return this.http.get<any>(
      environment.motherShipUrl +
        ':' +
        environment.apiPort +
        '/api/group/get-groups/',
    );
  }
}
