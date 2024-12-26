// Rx:
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
// Import Ag dependencies:
import { HttpClient, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
//import { query } from '@angular/animations';
// Constants:
import { system as importedSystemConst } from '../../../constants/system';
//Import Services:
import { SystemEnvironmentService } from '../../system.environment.service';
import { SystemDiagnosticsTraceService } from '../../system.diagnostics-trace.service';
import { SystemErrorService } from '../../system.error.service';
import { TypeService } from '../../type.service';
import { ObjectMappingService } from '../../infrastructure/objectMapping.service';
import { SystemSessionService } from '../../system.session.service';
import { SessionStorageService } from '../../infrastructure/SessionStorageService';
import { UrlService } from '../../url.service';
import { IHasStringKeyValue } from '../../../../core/models/contracts/IHasStringKeyValue';
import { ArrayService } from '../../array.service';
import { RepositoryStandardServicesPackage } from './_standard-repository-services-package';
import { ServiceService } from '../../system.service.service';
import { ServiceTenancyService } from '../../TenantService';
import { ServiceLanguagesService } from '../../service.languages.service';


/**
 * Abstract base class for developing
 * Repository Services specific to a target table/system object.
 *
 * The default operations are the standard BREAD/CRUD ones. 
 *
 * The hardest method to solve for within a repository service
 * in a default way, is the GetList/Page method that has to achieve several things.
 * a) Has to get a page of x records only.
 * b) Should be capable of mapping the results from a db record to
 *    a visual/presentation ('vto') equivalent model so as to change some values
 *    (eg: image type ids to image names that only the presentation layer knows)
 * c) Ensure that if the dev forgot that it's standard to stick on either a serviceId or tenantId
 *    depending on the db record model's type/properties (ie, whether it implements IHasServiceId or IHasTenantId).
 * d) Usually solve for ensuring that only enabled records are returned
 * e) ...etc...
 *
 * Hence why there is a GetPage(int) method, that in turn invokes
 * the internal but overrridable buildPagedRequestUrl() before invoking
 * this.makeListRequest().
 * It is the buildPagedRequestUrl() that you override if you are unsatisfied with
 * the default url being developed (eg: don't want it to restrict to enabled, for example).
 * 
 */ 
export abstract class MappedGenericRepositoryServiceBase<TDto,TVto> {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // Affects how build url variables:
  protected serverType: string;

  // Define Properties:
  protected endpointUrl: string;

  protected _lastRequest :string = '';

  protected _dtoInstance;
  protected _vtoInstance;

  protected typeService: TypeService;
  protected arrayService: ArrayService;
  protected environmentService: SystemEnvironmentService;
  protected serviceService: ServiceService;
  protected serviceTenancyService: ServiceTenancyService;
  protected diagnosticsTraceService: SystemDiagnosticsTraceService;
  protected errorService: SystemErrorService;
  protected objectMappingService: ObjectMappingService;
  protected sessionStorageService: SessionStorageService;
  protected urlService: UrlService;
  //NO: TODO: I think this causes a loop: protected serviceLanguagesService: ServiceLanguagesService;

  /**
   * Note that this base invokes mappingService
   * to ensure the mapper is created and maps registered
   * before we perform any repository calls.
   * 
   * TODO: I'm not yet sure how it's going to work with late bound modules.
   * TODO: not using the mapping service effectively yet.
   * TODO: I have not tried it yet but maybe could translate DB values too.
   * 
   */
  
  constructor(
    private repositoryStandardServicesPackage: RepositoryStandardServicesPackage,
    // Not sure if this is a singleton or each time injected one gets
    // another. I'm guessing at present it's not a singleton, to allow
    // multiple concurrent requests, hence why it's outside the previous
    // injection package
    protected http: HttpClient,

    /** the service resource url for this repo */
    protected resourceUrl: string,
  ) {
    // Got tired of having to edit all repos when I added more services
    // so now using a single class to inject them all.
    // Just need to wire them each up:
    this.typeService = this.repositoryStandardServicesPackage.typeService;
    this.arrayService = this.repositoryStandardServicesPackage.arrayService;
    this.environmentService = this.repositoryStandardServicesPackage.environmentService;
    this.serviceService = this.repositoryStandardServicesPackage.serviceService;
    this.serviceTenancyService = this.repositoryStandardServicesPackage.tenancyService;
    this.diagnosticsTraceService = this.repositoryStandardServicesPackage.diagnosticsTraceService;
    this.errorService = this.repositoryStandardServicesPackage.errorService;
    this.objectMappingService = this.repositoryStandardServicesPackage.objectMappingService;
    this.sessionStorageService = this.repositoryStandardServicesPackage.sessionStorageService;
    this.urlService = this.repositoryStandardServicesPackage.urlService;
    //this.serviceLanguagesService = this.repositoryStandardServicesPackage.servicelanguagesService;

    this._dtoInstance = this.typeService.create<TDto>();
    this._vtoInstance = this.typeService.create<TVto>();

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);

    // This is URL before it is appended with modifiers:
    this.endpointUrl = `${this.system.apis.baseRestUrl}${resourceUrl}`;

    // will be 'json-server', 'soul', or '.net.core'
    // and is used to drive the kind of rest query syntax to use
    // while we can't rely on OData :-(
    this.serverType = this.system.environment.custom.service.type;
  }

  
  // HttpClient API get() method => Fetch entitys list
  public getPage(pageNumber: number = 0, queryArgs: IHasStringKeyValue[] | null = null): Observable<TDto[]> {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.getPage()`);

    var url = this.buildPagedRequestUrl(pageNumber, queryArgs);
    this.diagnosticsTraceService.debug(`...${url}`);

    return this.makeListRequest(url);
  }

  public getPageAdChildrenOf(
    parentFK: string,
    page: number = 0,
    parentFKFieldName: string | undefined=undefined): Observable<TDto[]> {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.getPageChildren()`);

    if (!parentFKFieldName || parentFKFieldName.length == 0) {
      parentFKFieldName = importedSystemConst.storage.db.defaultFieldNames.parentFK;
    };
    var url: string =
      this.buildEnabledParentFKPagedRequestUrl(
        parentFK,
        parentFKFieldName,
        page);

    return this.makeListRequest(url);

  }

  /**
   * Method to make request to given url,
   * returning subscription.
   * 
   * No need to override in most cases.
   * Continue to look at overriding
   * ```buildPagedRequestUrl```
   * when needed.
   * @param url
   * @returns
   */
  protected makeListRequest(url:string ): Observable<TDto[]> {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.getPageInternal()`);

    // Final checks:
    url = this.appendServiceFKIfApplicable(url);
    url = this.appendTenantFKIfApplicable(url);

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
              this.diagnosticsTraceService.info(`...response received: GET: ${url}`);
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


  /**
  * HttpClient API get() method => Fetch entity
   * @param id
   * @returns
   */
  public getSingle(id: any): Observable<TDto|null> {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.get('${id}')`);

    // TODO: extract
    var url: string;
    if (this.serverType == 'json-server') {
      url = `${this.endpointUrl}/{${id}}`;
    } else if (this.serverType == 'soul') {
      throw "todo: soul";
    } else {
      throw "unrecognised api serverType";
    }
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
                //TODO may not work refering back to 'this': this.diagnosticsTraceService.info(`Response.body:${result}`);
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


  protected buildEnabledParentFKPagedRequestUrl(
    fkValue: string,
    fkPropertyName: string = importedSystemConst.storage.db.defaultFieldNames.parentFK,
    page: number = 1,
    enabled: boolean = true,
    queryArgs: IHasStringKeyValue[] | null = null): string {

    this.diagnosticsTraceService.debug(`${this.constructor.name}.buildEnabledParentFKPagedRequestUrl()`);

    return this.buildEnabledFKPagedRequestUrl(fkValue, fkPropertyName, page, enabled, queryArgs);
  }

  /**
 * Overriddable helper method to query for
 * a page of enabled entities that are a child of another (FK).
 * @param page
 * @param enabled
 * @param queryArgs
 * @returns
 */
  protected buildEnabledFKPagedRequestUrl(
    fkValue: string,
    fkPropertyName: string,
    page: number = 1,
    enabled: boolean = true,
    queryArgs: IHasStringKeyValue[] | null = null): string {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.buildEnabledFKPagedRequestUrl()`);

    var result = this.endpointUrl;// this.buildRequestUrl('', null, queryArgs);

    result = this.appendPagingInstructions(result, page);
    result = this.appendEnabledFilter(result, enabled);
    result = this.appendFKFilter (result, fkValue, fkPropertyName);
    result = this.appendQueryArgs(result, queryArgs);

    return result;
  }

  /**
   * Overriddable helper method to query for
   * a page of enabled entities.
   * @param page
   * @param enabled
   * @param queryArgs
   * @returns
   */
  protected buildEnabledPagedRequestUrl(page: number, enabled: boolean = true, queryArgs: IHasStringKeyValue[] | null = null): string {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.buildEnabledPagedRequestUrl()`);
    var result = this.endpointUrl;// this.buildRequestUrl('', null, queryArgs);
    result = this.appendPagingInstructions(result, page);
    result = this.appendEnabledFilter(result, enabled);
    result = this.appendQueryArgs(result, queryArgs);
    return result;
  }

  /**
   * Overrridable method to built a paged query
   * suitable for getPage.
   * @param page
   * @returns
   */
  protected buildPagedRequestUrl(page: number, queryArgs: IHasStringKeyValue[] | null = null): string {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.buildPagedRequestUrl()`);
    var result = this.endpointUrl;// this.buildRequestUrl();
    result = this.appendServiceFKIfApplicable(result)
    result = this.appendPagingInstructions(result, page);
    result = this.appendQueryArgs(result, queryArgs);
    return result;
  }

  /**
   * Overridable helper method to
   * built urls for resoruces with
   * zero or more modifier arguments appended.
   * @param serviceUrl
   * @param resourcePath
   * @param queryArgs
   * @returns
   */
  protected buildRequestUrl(serviceUrl: string|null=null, resourcePath: string|null=null, queryArgs: IHasStringKeyValue[] | null = null): string {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.buildRequestUrl()`);

    let result: string;
    if (!serviceUrl) {
      result = this.endpointUrl;
    } else {
      // this will be the url to the base API url
      // which might start with
      // https://whatever, or http:localhost:4200
      // and might end with 'api/' (if json-server)
      // or 'tables/' if soul server,
      // etc.
      result = serviceUrl;

      // Append the resource path next if provided (can be just base in some cases):
      if (resourcePath !== undefined && resourcePath !== null && resourcePath.length > 0) {
        if (!resourcePath.startsWith('/')) {
          result += '/';
        }
        result += (result.endsWith('/')) ? resourcePath.substring(1) : resourcePath;
      }
    }

    return this.appendQueryArgs(result, queryArgs);
  }
  protected appendEmbedInstructions(url: string, childTable: string) {

    
    let queryArgs: IHasStringKeyValue[];
    if (this.serverType == 'json-server') {
      queryArgs = [
        { key: '_embed', value: childTable },
      ];
    } else if (this.serverType == 'soul') {
      throw "todo: soul";
    } else {
      throw "unrecognised api serverType";
    }
    return this.appendQueryArgs(url, queryArgs);
 }

  /**
   * Helper method
   * @param url
   * @param page
   * @returns
   */
  protected appendMatchInstructions(url: string, parameterName: string, matchValue: string, matchChar: string = '=') {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.appendMatchInstructions()`);
    // OH DO I MISS ODATA (standards based queryabiltiy versus hand crafted brittle rubbish)...
    // TODO: exact syntax Will depend on what type of server is being used.
    // eg: if (this.system.environment.isJsonServerContext) {...etc...}

    let queryArgs: IHasStringKeyValue[];
    if (this.serverType == 'json-server') {
      queryArgs = [
      { key: parameterName, value: matchValue },
    ];
    } else if (this.serverType == 'soul') {
      throw "todo: soul";
    } else {
      throw "unrecognised api serverType";
    }
    return this.appendQueryArgs(url, queryArgs, matchChar);
  }

  /**
   * Helper method
   * @param url
   * @param page
   * @returns
   */
  protected appendPagingInstructions(url: string, page: number=1) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.appendPagingInstructions()`);
    // OH DO I MISS ODATA (standards based queryabiltiy versus hand crafted brittle rubbish)...
    // TODO: exact syntax Will depend on what type of server is being used.
    // eg: if (this.system.environment.isJsonServerContext) {...etc...}
    let queryArgs: IHasStringKeyValue[];
    if (this.serverType == 'json-server') {
      queryArgs = [
        { key: 'page', value: page.toString() },
        { key: '_per_page', value: this.system.apis.recordsPerPage.toString() }
      ];
    } else if (this.serverType == 'soul') {
      throw "todo: soul";
    } else {
      throw "unrecognised api serverType";
    }
    return this.appendQueryArgs(url, queryArgs);
  }
          
  /**
 * Append standard enabled=true|false filtering to query request
 * being developed.
 * @param url
 * @param enabled
 * @returns
 */
  protected appendEnabledFilter(url: string, enabled: boolean = true, enabledPropertyName:string='enabled') {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.appendEnabledFilter()`);
    // OH DO I MISS ODATA (standards based queryabiltiy versus hand crafted brittle rubbish)...
    // TODO: exact syntax Will depend on what type of server is being used.
    // eg: if (this.system.environment.isJsonServerContext) {...etc...}

    let queryArgs: IHasStringKeyValue[];
    if (this.serverType == 'json-server') {
      //const comparisionSymbols = '=';
      //${comparisionSymbols}
      queryArgs =
        [
          { key: `${enabledPropertyName}`, value: (enabled).toString() },
        ];
    } else if (this.serverType == 'soul') {
      throw "todo: soul";
    } else if (this.serverType == '.net.core') {
      throw "todo: .net.core";
    } else {
      throw "unrecognised api serverType";
    }
    return this.appendQueryArgs(url, queryArgs);
  }

  protected appendServiceFKIfApplicable(url: string): string {
    if (!this.typeService.hasProperty(
      this._dtoInstance,
      importedSystemConst.storage.db.defaultFieldNames.serviceFK)) {
      return url;
    }
    url = this.appendMatchInstructions
      (url, importedSystemConst.storage.db.defaultFieldNames.serviceFK,
        this.serviceService.id
      );
    return url;
  }


  protected appendTenantFKIfApplicable(url: string): string {
    if (!this.typeService.hasProperty(
      this._dtoInstance,
      importedSystemConst.storage.db.defaultFieldNames.tenancyFK)) {
      return url;
    }
    url = this.appendMatchInstructions
      (url, importedSystemConst.storage.db.defaultFieldNames.tenancyFK,
        this.serviceTenancyService.id
      );
    return url;
  }

  /**
   * Helper method to append
   * a modifier to an url
   * to restrict records to those that have a
   * specific parentFK (ie are children thereof)
   * @param url
   * @param parentFK
   * @param FKPropertyName
   * @returns
   */
  protected appendParentFKFilter(
    url: string,
    parentFK: string,
    FKPropertyName: string = importedSystemConst.storage.db.defaultFieldNames.parentFK): string {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.appendParentFKFilter()`);
    return this.appendFKFilter(url, parentFK, FKPropertyName);
  }

  /**
   * 
   * @param url
   * @param parentFK
   * @param FKPropertyName
   */
  protected appendFKFilter(url: string, fkValue: string, FKPropertyName: string): string {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.appendFKFilter()`);

    // OH DO I MISS ODATA (standards based queryabiltiy versus hand crafted brittle rubbish)...
    // TODO: exact syntax Will depend on what type of server is being used.
    // eg: if (this.system.environment.isJsonServerContext) {...etc...}

    let queryArgs: IHasStringKeyValue[];
    if (this.serverType == 'json-server') {
      const comparisonSymbols = '=';
      queryArgs = [
        { key: `${FKPropertyName}${comparisonSymbols}`, value: fkValue },
      ];
    } else if (this.serverType == 'soul') {
      throw "todo: soul";
    } else if (this.serverType == '.net.core') {
      throw "todo: .net.core";
    } else {
      throw "unrecognised api serverType";
    }
    return this.appendQueryArgs(url, queryArgs);
  }



  /**
   * Protected helper method to append QueryArguments
   * to given resource url.
   */
  protected appendQueryArgs(url: string, queryArgs: IHasStringKeyValue[] | null, matchChar:string='='): string {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.appendQueryArgs()`);

    return this.urlService.appendQueryArgs(url, queryArgs, matchChar);
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






  /**
   * Helper method to options package
   * containing HttpHeaders
   * to append to Queryies being made,
   * @returns
   */
  protected buildOptions(): any {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.buildOptions()`);
    return { headers: this.buildHttpHeaders() };
  }

  /**
   *  Helper method to make options
   * package containing HttpHeaders
   * to append to Queries being made.
   *
   * Essentially just providing a
   * user bearer token if available
   * and stating we want the results in json.
   * @returns
   */
  protected buildHttpHeaders(): HttpHeaders {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.buildHttpHeaders()`);

    var bearerToken = this.sessionStorageService.getItem(this.system.storage.system.token);

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${bearerToken}`);

    return headers;
  }

  protected HasServiceId(tenancyIdFieldName: string = this.system.storage.db.defaultFieldNames.serviceFK) {
    var result = this.typeService.hasProperty(
      this._dtoInstance,
      importedSystemConst.storage.db.defaultFieldNames.serviceFK);

    return result;
  }

  protected HasTenancyId(tenancyIdFieldName:string = this.system.storage.db.defaultFieldNames.tenancyFK) {
    var result = this.typeService.hasProperty(
      this._dtoInstance,
      importedSystemConst.storage.db.defaultFieldNames.tenancyFK);

    return result;
  }

  /** Override/Implement virtual method to map
   * from Data objects
   * to Visual/simpler objects
   */
  protected abstract MapObjectTo(dto: TDto): TVto;

/** Override/Implement virtual method to map
 * from visual/ux objects
 * on/to data objects objects
 */
  protected abstract MapObjectFrom(dto: TVto): TDto;






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

}
