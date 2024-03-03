//import { Injectable } from  '@angular/core';
//import { HttpClient } from '@angular/common/http';
//import { Observable } from 'rxjs';

//// Import app-module specific model:
//import { Spike } from '../models/spike.model';
//// Import services:
//import { SystemSettingsService } from '../../../shared/services/system-settings.service';

////Decorate:
//@Injectable(
//  //{ providedIn: ' root ' }
//)
////Define:
//export class SpikeRepositoryService extends GenericRepositoryService<Spike> {
//  //TODO: Awful hard encoding:
//  private apiUrl = 'https://api.example.com/users';

//  constructor(
//    private systemSettingsService: SystemSettingsService,
//    private http: HttpClient) {

//    this.apiUrl = systemSettingsService.baseUrl;

//  }

//  getAll(): Observable<Spike[]> {
//    return this.http.get<Spike[]>(this.apiUrl);
//  }
//  getById(id: number): Observable<Spike> {
//    return this.http.get<Spike>('${ this.apiUrl } / ${ id }');
//  }
//  create(entity: Spike): Observable<Spike> {
//    return this.http.post<Spike>(this.apiUrl, entity);
//  }
//  update(entity: Spike): Observable<Spike> {
//    return this.http.put<Spike>('${ this.apiUrl } / ${ entity.id }', entity);
//  }
//  delete(id: number): Observable<Spike> {
//    return this.http.delete<Spike>('${ this.apiUrl } / ${ id }');
//  }
//}

