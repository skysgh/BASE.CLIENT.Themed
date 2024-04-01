// Import Ag dependencies:
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError,map } from 'rxjs/operators';
//Import Models:
import { EnvironmentService } from '../../environment.service';
import { DiagnosticsTraceService } from '../../diagnostics.service';
import { ErrorService } from '../../error.service';
import { TypeService } from '../../type.service';
import { ObjectMappingService } from '../../objectMapping.service';
import { SessionService } from '../../session.service';
import { SessionStorageService } from '../../SessionStorageService';
import { UrlService } from '../../url.service';

// Describe the service:
@Injectable({ providedIn: 'root' })

/**
* Injectable abstract base for
* services to provide generic repository services that
* wrap calls to the backend service endpoints, with the option
* of mapping the return objects - DTOs from a server API - to
* something more ready for the front end.
* An easy example is converting a typeFK to an image name
* (although leave the pathing to the front end) and so forth.

* Used some learnings from:
* https://betterprogramming.pub/a-generic-http-service-approach-for-angular-applications-a7bd8ff6a068
* https://www.positronx.io/angular-httpclient-http-service/
 */

export abstract class MappedGenericRepositoryServiceBase<TDto,TVto> {

  // Affects how build url variables:
  protected isJsonServer: boolean;

  // Define Properties:
  protected endpointUrl: string;

  protected _lastRequest :string = '';

  /**
   * Note that this base invokes mappingService
   * to ensure the mapper is created and maps registered
   * before we perform any repository calls.
   * 
   * TODO: I'm not yet sure how it's going to work with late bound modules.
   * TODO: not using the mapping service effectively yet.
   * TODO: I have not tried it yet but maybe could translate DB values too.
   * 
   * @param typeService
   * @param environmentService
   * @param diagnosticsTraceService
   * @param objectMappingService
   * @param errorService
   * @param http
   * @param apiUrlEndpointSuffix
   */
  constructor(
    protected typeService: TypeService,
    protected environmentService: EnvironmentService,
    protected diagnosticsTraceService: DiagnosticsTraceService,
    protected errorService: ErrorService,
    protected objectMappingService: ObjectMappingService,
    protected sessionStorageService: SessionStorageService,
    protected urlService: UrlService,
    protected http: HttpClient,
    protected apiUrlEndpointSuffix: string,
  ) {
    var t = `${environmentService.getRestApiBaseUrl()}${apiUrlEndpointSuffix}`;
    this.endpointUrl = `${environmentService.getRestApiBaseUrl()}${apiUrlEndpointSuffix}`;
    this.isJsonServer = this.environmentService.isJsonServerContext;
  }

  
  // HttpClient API get() method => Fetch entitys list
  public getPage(pageNumber: number = 0): Observable<TDto[]> {
    return this.getPageInternal(pageNumber);
  }

  protected getPageInternal(pageNumber: number = 0, queryArguments:string = ''): Observable<TDto[]> {

    var url = this.buildPagedRequestUrl(pageNumber);
    this._lastRequest = url;

    this.diagnosticsTraceService.info(`querying: GET: ${url}`);

    var options = this.buildOptions();

    const c = this;

    var result$ =
      this.http
        .get<TDto[]>(url, options)
        .pipe(
          map((event: HttpEvent<TDto[]>) => {
            if (event instanceof HttpResponse) {
              return event.body || []; // Extract the data array from the response
            } else {
              return Array.isArray(event) ? event : [];
              //return (event as TDto[]); // Extract the data array from the response
            }
          }),
          retry(1),
          catchError((x) => { return this.handleError (x)})
      );

    // no point diagnostictracing here (it's just the wrapping observable, not
    // the results that will return later)

    return result$;
  }



  //getPageWithMappingToClass(page: number = 0): Observable<TDto> {
  //  var url: string = this.buildRequestUrl('', this.isJsonServer ? `_page=${page}&_per_page=20` : 'TODO');
  //  this.diagnosticsTraceService.info(`querying: GET: ${url}`);

  //  var result =
  //    this.http.get<TDto>(url)
  //      .pipe(
  //        map(data => this.typeService.create<TDto>(data))
  // catchError((x) => { return this.handleError(x) })

  //  this.diagnosticsTraceService.info(result);
  //  return result;
  //}

//  getPageWithoutMappingToClass(page: number = 0): Observable<TDto | null > {

//    var url: string = this.buildRequestUrl('', this.isJsonServer ? `_page=${page}&_per_page=20` : 'TODO');

//    this.diagnosticsTraceService.info(`querying: GET: ${url}`);

//    var options = this.buildOptions();

//    const c = this;

//    var result$ =
//      this.http.get<TDto>(
//        url,
//        options)
//        .pipe(
//          map((event: HttpEvent<TDto>) => {
//            if (event instanceof HttpResponse) {
//              var result = event.body; // Extract the data array from the response
//              this.diagnosticsTraceService.info(`Response.body:${result}`);
//              return result;
//            } else {
//              throw new Error('Unexpected event type');
//            }
//          }),
//          retry(1),
//  catchError((x) => { return this.handleError(x) })
//        );

//    this.diagnosticsTraceService.info(result$);

//    return result$;
//  }

  getPageChildren(parentFK: any, page: number = 0): Observable<TDto[]> {

    var url: string = this.buildRequestUrl('', this.isJsonServer ? `parentFK=${[parentFK]}&_page=${page}&_per_page=20` : 'TODO');

    this.diagnosticsTraceService.info(`querying: GET: ${url}`);

    var options = this.buildOptions();

    const c = this;

    var result =
      this.http
      .get<TDto[]>(url, options)
      .pipe(
        map((event: HttpEvent<TDto[]>) => {
          if (event instanceof HttpResponse) {
            return event.body || []; // Extract the data array from the response
          } else {
            throw new Error('Unexpected event type');
          }
        }),

        retry(1),
        catchError((x) => { return this.handleError(x) })
      );
    this.diagnosticsTraceService.info(result);

    return result;
  }

  // HttpClient API get() method => Fetch entity
  get(id: any): Observable<TDto|null> {
    var url: string = this.buildRequestUrl(this.isJsonServer ? `/${id}` : 'TODO');
    this.diagnosticsTraceService.info(`querying: GET: ${url}`);

    var options = this.buildOptions();

    const c = this;

    var result$ =
      this.http
        .get<TDto>(
          url,
          options)
        .pipe(
            map((event: HttpEvent<TDto>) => {
              if (event instanceof HttpResponse) {
                var result = event.body ; // Extract the data array from the response
                this.diagnosticsTraceService.info(`Response.body:${result}`);
                return result;
              } else {
                throw new Error('Unexpected event type');
              }
            }),
          retry(1),
          catchError((x) => { return this.handleError(x) })
      );

    this.diagnosticsTraceService.info(result$);

    return result$;
  }

  

  //// HttpClient API post() method => Create entity
  //create(entity: any): Observable<TDto|null> {
  //  var url: string = this.buildRequestUrl(this.isJsonServer ? '' : 'TODO');
  //  this.diagnosticsTraceService.info(`querying: POST: ${url}`);

  //  var options = this.buildOptions();

  //  const c = this;

  //  var result$ =
  //    this.http
  //      .post<TDto>(
  //        url,
  //        JSON.stringify(entity),
  //        options)
  //      .pipe(
  //        map((event: HttpEvent<TDto>) => {
  //          if (event instanceof HttpResponse) {
  //            var result = event.body; // Extract the data array from the response
  //            this.diagnosticsTraceService.info(`Response.body:${result}`);
  //            return result;
  //          } else {
  //            throw new Error('Unexpected event type');
  //          }
  //        }),
  //        retry(1),
//  catchError((x) => { return this.handleError(x) })
  //      );
  //  this.diagnosticsTraceService.info(result$);

  //  return result$;
  //}

  //// HttpClient API put() method => Update entity
  //update(id: any, entity: any): Observable<TDto|null> {
  //  var url = this.buildRequestUrl('/${id}')
  //  this.diagnosticsTraceService.info(`querying: PUT: ${url}`);

  //  var options = this.buildOptions();

  //  const c = this;

  //  var result$ =
  //    this.http
  //      .put<TDto>(url,
  //        JSON.stringify(entity),
  //        options)
  //      .pipe(
  //        map((event: HttpEvent<TDto>) => {
  //          if (event instanceof HttpResponse) {
  //            var result= event.body; // Extract the data array from the response
  //            this.diagnosticsTraceService.info(`Response.body:${result}`);
  //            return result;
  //          } else {
  //            throw new Error('Unexpected event type');
  //          }
  //        }),
  //        retry(1),
  // catchError((x) => { return this.handleError(x) })
  //      );

  //  this.diagnosticsTraceService.info(result$);

  //  return result$;
  //}


  //// HttpClient API delete() method => Delete entity
  //delete(id: any):void  {

  //  var url = this.buildRequestUrl('/${id}')

  //  this.diagnosticsTraceService.info(`querying: DELETE: ${url}`);

  //  var options = this.buildOptions();

  //  const c = this;

  //  var result$ =
  //    this.http
  //      .delete<TDto>(
  //        url,
  //        options)
  //      .pipe(
  //        map((event: HttpEvent<TDto>) => {
  //          if (event instanceof HttpResponse) {
  //            var result = event.body; // Extract the data array from the response
  //            this.diagnosticsTraceService.info(`Response.body:${result}`);
  //            return result;
  //          } else {
  //            throw new Error('Unexpected event type');
  //          }
  //        }),
  //        retry(1),
  // catchError((x) => { return this.handleError(x) })
  //      );
  //  //return result$;
  //}

  /**
   * Overrridable method to built a paged query
   * suitable for getPage.
   * @param page
   * @returns
   */
  protected buildPagedRequestUrl(page: number, queryArgs:string =''): string {
    return this.buildRequestUrl('',
      (this.isJsonServer ? `_page=${page}&_per_page=20` : 'TODO')
      + (queryArgs ? ('&' + queryArgs) : ''));
  }

  //
  protected buildRequestUrl(suffix: string = '', queryArgs: string = ''): string{
    return this.urlService.buildUpUrl(this.endpointUrl, suffix, queryArgs);
  }

  protected buildUrl(baseurl: string, suffix?: string, queryArgs?: string): string {
  let url = baseurl;

  // Append suffix if provided
  if (suffix !== undefined && suffix !== null) {
    if (!suffix.startsWith('/')) {
      url += '/';
    }
    if (url.endsWith('/')) {
      url += suffix.substring(1);
    } else {
      url += suffix;
    }
  }

  // Append query args if provided
  if (queryArgs !== undefined && queryArgs !== null) {
    if (!queryArgs.startsWith('?')) {
      if (url.indexOf('?') === -1) {
        url += '?';
      } else {
        url += '&';
      }
    }
    url += queryArgs;
  }

  return url;
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
  protected handleError(error: any /*Error*/) {
    //var check = this._lastRequest;

    var errorMessage = '';// this.errorService.report(error);
    
    return throwError(() => {return errorMessage;});





  }






  protected buildHttpHeaders(): HttpHeaders {

    var bearerToken = this.sessionStorageService.getItem('token');

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${bearerToken}`);

    return headers;
  }

  protected buildOptions(): any {
    return { headers: this.buildHttpHeaders() };
  }


  protected abstract MapObjectTo(dto: TDto): TVto;
  protected abstract MapObjectFrom(dto: TVto): TDto;

}
