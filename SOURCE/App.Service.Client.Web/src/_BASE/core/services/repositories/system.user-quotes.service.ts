import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
//import { env } from "process";
import { MappedGenericRepositoryServiceBase } from "./base/mapped-generic-repository.service.base";
import { DiagnosticsTraceService } from "../diagnostics.service";
import { EnvironmentService } from "../environment.service";
import { ErrorService } from "../error.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TypeService } from "../type.service";
import { UserQuote } from "../../models/data/user-quote.model";
import { ObjectMappingService } from '../objectMapping.service';
// Constants:
import { SystemQueryEndpoints } from "../../constants/systemQueryEndpoints";
import { SessionStorageService } from '../SessionStorageService';
import { UrlService } from '../url.service';
import { TranslationService } from '../translation.service';
import { SimpleGenericRepositoryServiceBase } from './base/simple-generic-repository-service.base';
// import models:

/**
 * Stateless service to manage interactions with
 * an API provided by the service
 * for system user quotes.
 * Being stateless, ok to have only one instance, so registere in the root:
 */

@Injectable({ providedIn: 'root' })
export class SystemUserQuoteRepositoryService
  extends SimpleGenericRepositoryServiceBase<UserQuote> {

  constructor(
    typeService: TypeService,
    environmentService: EnvironmentService,
    diagnosticsTraceService: DiagnosticsTraceService,
    errorService: ErrorService,
    objectMappingService: ObjectMappingService,
    sessionStorageService: SessionStorageService,
    urlService: UrlService,
    private translationService: TranslationService,
     httpClient: HttpClient) {
    super(
      typeService,
      environmentService,
      diagnosticsTraceService,
      errorService,
      objectMappingService,
      sessionStorageService,
      urlService,
      httpClient,
      SystemQueryEndpoints.userQuotes
      
    );
  }
  getPageByLanguageCode(langCode:string, page: number = 0): Observable<UserQuote> {


    var url: string
      = this.buildRequestUrl(
      this.isJsonServer
        ? `?languageCode ${langCode}&_page=${page}&_per_page=20`
        : 'TODO');

    this.diagnosticsTraceService.info(`querying: GET: ${url}`);

    var result =
      this.http
        .get<UserQuote>(url)
        .pipe(
          retry(1),
          catchError(this.handleError)
        );

    this.diagnosticsTraceService.info(result);
    return result;
  }

}
