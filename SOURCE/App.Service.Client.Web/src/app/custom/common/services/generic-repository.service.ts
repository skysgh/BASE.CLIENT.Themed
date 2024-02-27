// Import Ag dependencies:
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
//Import Models:
import { ReferenceData } from '../models/reference-item.model';
import { EnvironmentService } from './environment.service';
import { DiagnosticsService } from './diagnostics.service';
import { ErrorService } from './error.service';

// Describe the service:
@Injectable({ providedIn: 'root' })

// Injectable service to provide generic repository services that
  // wrap calls to the backend service endpoints.

  // References:
  // https://betterprogramming.pub/a-generic-http-service-approach-for-angular-applications-a7bd8ff6a068
  // https://www.positronx.io/angular-httpclient-http-service/
export abstract class GenericRepositoryService<Type> {

  // Define Properties:
  private endpointUrl: string;
  // Http Options
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  //
  constructor(
    private environmentService: EnvironmentService,
    private diagnosticsService: DiagnosticsService,
    private errorService: ErrorService,
    private http: HttpClient,
    private apiUrlEndpointSuffix: string) {

    this.endpointUrl = `${environmentService.getRestApiBaseUrl()}${apiUrlEndpointSuffix}`;

  }

  // HttpClient API get() method => Fetch entitys list
  getAll(page:number=0): Observable<Type> {
    return this.http
      .get<Type>(this.endpointUrl + `?_page=${page}&_per_page=20`)
      .pipe(retry(1), catchError(this.handleError));
  }
  // HttpClient API get() method => Fetch entity
  get(id: any): Observable<Type> {
    return this.http
      .get<Type>(`${this.endpointUrl}/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }
  // HttpClient API post() method => Create entity
  create(entity: any): Observable<Type> {
    return this.http
      .post<Type>(`${this.endpointUrl}`,
        JSON.stringify(entity),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }
  // HttpClient API put() method => Update entity
  update(id: any, entity: any): Observable<Type> {
    return this.http
      .put<Type>(`${this.endpointUrl}/${id}`,
        JSON.stringify(entity),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }
  // HttpClient API delete() method => Delete entity
  delete(id: any) {
    return this.http
      .delete<Type>(
        `${this.endpointUrl}/${id}`,
        this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // Error handling
  private handleError(error: any) {
    var errorMessage = this.errorService.report(error);

    return throwError(() => {
      return errorMessage;
    });
  }
}
