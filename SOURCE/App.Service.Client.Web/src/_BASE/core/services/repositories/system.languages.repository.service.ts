//Rx:
import { Observable, catchError, retry } from "rxjs";
//Ag:
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// Constants:
import { system as importedSystemConst } from '../../constants/system';
// Services:
//import { env } from "process";
import { MappedGenericRepositoryServiceBase } from "./base/mapped-generic-repository.service.base";
import { DiagnosticsTraceService } from "../diagnostics.service";
import { EnvironmentService } from "../environment.service";
import { ErrorService } from "../error.service";
import { TypeService } from "../type.service";
import { SessionStorageService } from "../SessionStorageService";
import { UrlService } from "../url.service";
import { SimpleGenericRepositoryServiceBase } from "./base/simple-generic-repository-service.base";
import { ObjectMappingService } from "../objectMapping.service";
// Models/Data:
import { SystemLanguage } from "../../models/data/system-language.model";
// Constants:

/**
 * Stateless service to manage interactions with
 * an API provided by the service
 * for System Languages.
 * Being stateless, ok to have only one instance, so registere in the root:
 */

@Injectable({ providedIn: 'root' })
export class SystemLanguagesRepositoryService
  extends SimpleGenericRepositoryServiceBase<SystemLanguage> {

  constructor(
    typeService: TypeService,
    environmentService: EnvironmentService,
    diagnosticsTraceService: DiagnosticsTraceService,
    errorService: ErrorService,
    objectMappingService: ObjectMappingService,
    sessionStorageService: SessionStorageService,
    urlService: UrlService,
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
      importedSystemConst.apis.base_languages
    );
  }

  // HttpClient API get() method => Fetch entitys list
  public getPageEnabled(page: number = 0): Observable<SystemLanguage[]> {
    var url: string = this.buildRequestUrl('',this.isJsonServer ? `enabled_ne=false&_page=${page}&_per_page=20` : 'TODO');
    this.diagnosticsTraceService.info(`querying: GET: ${url}`);

    var result =
      this.http
        .get<SystemLanguage[]>(url)
        .pipe(
          retry(1),
          catchError(this.handleError)
        );

    this.diagnosticsTraceService.info(result);
    return result;
  }


}
