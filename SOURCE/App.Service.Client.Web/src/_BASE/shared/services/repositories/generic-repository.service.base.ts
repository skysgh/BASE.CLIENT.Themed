// Import Ag dependencies:
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError,map } from 'rxjs/operators';
//Import Models:
import { ReferenceData } from '../../models/reference-item.model';
import { EnvironmentService } from '../environment.service';
import { DiagnosticsService } from '../diagnostics.service';
import { ErrorService } from '../error.service';
import { TypeService } from '../type.service';

// Describe the service:
@Injectable({ providedIn: 'root' })

// Injectable service to provide generic repository services that
  // wrap calls to the backend service endpoints.

  // References:
  // https://betterprogramming.pub/a-generic-http-service-approach-for-angular-applications-a7bd8ff6a068
  // https://www.positronx.io/angular-httpclient-http-service/
export abstract class GenericRepositoryServiceBase<Type> {

  // Affects how build url variables:
  private isJsonServer: boolean;

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
    private typeService: TypeService,
    private environmentService: EnvironmentService,
    private diagnosticsService: DiagnosticsService,
    private errorService: ErrorService,
    private http: HttpClient,
    private apiUrlEndpointSuffix: string) {

    this.endpointUrl = `${environmentService.getRestApiBaseUrl()}${apiUrlEndpointSuffix}`;
    this.isJsonServer = this.environmentService.isJsonServerContext;
  }

  // HttpClient API get() method => Fetch entitys list
  getAll(page: number = 0): Observable<Type> {
    var url : string = this.buildRequestUrl(this.isJsonServer ? `?_page=${page}&_per_page=20` : 'TODO');
    this.diagnosticsService.info(`querying: GET: ${url}`);

    var result =
      this.http
      .get<Type>(url)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );

    this.diagnosticsService.info(result);
    return result;
  }
  getAllWithMapper(page: number = 0): Observable<Type> {
    var url: string = this.buildRequestUrl(this.isJsonServer ? `?_page=${page}&_per_page=20` : 'TODO');
    this.diagnosticsService.info(`querying: GET: ${url}`);

    var result = this.http
      .get<Type>(url)
      .pipe(retry(1), catchError(this.handleError));

    this.diagnosticsService.info(result);
    return result;
  }

  //getAllWithMappingToClass(page: number = 0): Observable<Type> {
  //  var url: string = this.buildRequestUrl(this.isJsonServer ? `?_page=${page}&_per_page=20` : 'TODO');
  //  this.diagnosticsService.info(`querying: GET: ${url}`);

  //  var result =
  //    this.http.get<Type>(url)
  //      .pipe(
  //        map(data => this.typeService.create<Type>(data))
  //          .catch(this.handleError));

  //  this.diagnosticsService.info(result);
  //  return result;
  //}

  getAllWithoutMappingToClass(page: number = 0): Observable<Type> {
    var url: string = this.buildRequestUrl(this.isJsonServer ? `?_page=${page}&_per_page=20` : 'TODO');
    this.diagnosticsService.info(`querying: GET: ${url}`);

    var result = this.http.get<Type>(url);
    this.diagnosticsService.info(result);

    return result;
  }

  getAllChildren(parentFK: any, page: number = 0): Observable<Type> {
    var url: string = this.buildRequestUrl(this.isJsonServer ? `?parentFK=${[parentFK]}&_page=${page}&_per_page=20` : 'TODO');
    this.diagnosticsService.info(`querying: GET: ${url}`);

    var result = this.http
      .get<Type>(url)
      .pipe(retry(1), catchError(this.handleError));
    this.diagnosticsService.info(result);

    return result;
  }

  // HttpClient API get() method => Fetch entity
  get(id: any): Observable<Type> {
    var url: string = this.buildRequestUrl(this.isJsonServer ? `/${id}` : 'TODO');
    this.diagnosticsService.info(`querying: GET: ${url}`);

    var result =
      this.http
        .get<Type>(url)
        .pipe(retry(1), catchError(this.handleError));
    this.diagnosticsService.info(result);
    return result;
  }

  

  // HttpClient API post() method => Create entity
  create(entity: any): Observable<Type> {
    var url: string = this.buildRequestUrl(this.isJsonServer ? `` : 'TODO');
    this.diagnosticsService.info(`querying: POST: ${url}`);

    var result =
      this.http
      .post<Type>(url, JSON.stringify(entity), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
    this.diagnosticsService.info(result);
    return result;
  }
  // HttpClient API put() method => Update entity
  update(id: any, entity: any): Observable<Type> {
    var url = this.buildRequestUrl('/${id}')
    this.diagnosticsService.info(`querying: PUT: ${url}`);
    var result =
      this.http
        .put<Type>(url, JSON.stringify(entity), this.httpOptions)
        .pipe(retry(1), catchError(this.handleError));

    this.diagnosticsService.info(result);
    return result;
  }
  // HttpClient API delete() method => Delete entity
  delete(id: any) {
    var url = this.buildRequestUrl('/${id}')
    this.diagnosticsService.info(`querying: DELETE: ${url}`);
    var result =
      this.http
      .delete<Type>(url,this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
    this.diagnosticsService.info(result);
    return result;
  }

  private buildRequestUrl(queryArgs:string) : string{
    return this.endpointUrl + queryArgs;
  }

  //private handleHttpError() {
  //  catchError((error: HttpErrorResponse) => {
  //    if (error.status != 200) {
  //      // handle error and use any value you like to return if that's your goal.
  //      // This could be anything, like a number, string or an object, depending on your use-case.
  //      const fallbackValue: Room = { properties... };
  //      return of(fallbackValue); // You will get this in your subscription callback
  //    } else {
  //      // return error
  //      return throwError(error);
  //    }
  //  }),
  //}
  // Error handling
  private handleError(error: any /*Error*/) {
    var errorMessage = this.errorService.report(error);
    
    return throwError(() => {return errorMessage;});
  }
}
