import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class GrapherService {

  constructor(private http: HttpClient) { }
}
