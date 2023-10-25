import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Group,
  GroupBase,
  GroupCreateResponse,
  GroupsSummery,
  BackendResponse,
} from 'src/app/interfaces/group/group';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  url = environment.motherShipUrl + ':' + environment.apiPort + '/api/groups/';
  constructor(private http: HttpClient) {}

  createGroup(groupData: GroupBase): Observable<GroupCreateResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post<GroupCreateResponse>(
      this.url + 'create-group/',
      groupData,
      httpOptions,
    );
  }

  getGroups(): Observable<GroupsSummery> {
    return this.http.get<GroupsSummery>(this.url + 'get-groups');
  }

  getGroup(groupId: number): Observable<Group> {
    return this.http.get<Group>(this.url + 'get-group/' + groupId + '/');
  }

  deleteGroup(groupId: number): Observable<any> {
    return this.http.delete<any>(this.url + 'delete-group/' + groupId + '/');
  }

  updateGroup(groupId: number, groupData: GroupBase): Observable<GroupBase> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.put<GroupBase>(
      this.url + 'update-group/' + groupId + '/',
      groupData,
      httpOptions,
    );
  }

  addMember(groupId: number, username: string): Observable<BackendResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    const data = {
      username: username,
    };

    return this.http.post<BackendResponse>(
      this.url + 'add-member/' + groupId + '/',
      data,
      httpOptions,
    );
  }

  deleteMember(groupId: number, username: string): Observable<BackendResponse> {
    return this.http.delete<BackendResponse>(
      this.url + 'remove-member/' + groupId + '/' + username + '/',
    );
  }

  addAdmin(groupId: number, username: string): Observable<BackendResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    const data = {
      username: username,
    };

    return this.http.post<BackendResponse>(
      this.url + 'add-admin/' + groupId + '/',
      data,
      httpOptions,
    );
  }

  deleteAdmin(groupId: number, username: string): Observable<BackendResponse> {
    return this.http.delete<BackendResponse>(
      this.url + 'remove-admin/' + groupId + '/' + username + '/',
    );
  }

  addSensor(groupId: number, sensorId: number): Observable<BackendResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post<BackendResponse>(
      this.url + 'add-sensor/' + groupId + '/' + sensorId + '/',
      {},
      httpOptions,
    );
  }

  deleteSensor(groupId: number, sensorId: number): Observable<BackendResponse> {
    return this.http.delete<BackendResponse>(
      this.url + 'remove-sensor/' + groupId + '/' + sensorId + '/',
    );
  }
}
