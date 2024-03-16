import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
//import { env } from "process";
import { GenericRepositoryServiceBase } from "./base/generic-repository.service.base";
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
// import models:

/**
 * Stateless service to manage interactions with
 * an API provided by the service
 * for system user quotes.
 * Being stateless, ok to have only one instance, so registere in the root:
 */

@Injectable({ providedIn: 'root' })
export class SystemUserQuoteRepositoryService
  extends GenericRepositoryServiceBase<UserQuote, UserQuote> {

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
  getPageByLanguageCode(langCode: 'en', page: number = 0): Observable<UserQuote> {


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
  /**
 * Map incoming TDto to a TVto more appropriate for the UI.
 * TODO: need to use the proper service to do this kind of work.
 * @param dto
 * @returns
 */
  protected override MapObjectTo(dto: any): any {
    //this.objectMappingService.map(dto..., ...);
    return ((dto as unknown) as any);
  }
  /**
 * Map TVto back to a TDto more appropriate for saving/updating in a db.
 * TODO: need to use the proper service to do this kind of work.
 * @param dto
 * @returns
 */
  protected override MapObjectFrom(vto: any): any {
    //this.objectMappingService.map(dto..., ...);
    return ((vto as unknown) as any);
  }

}
