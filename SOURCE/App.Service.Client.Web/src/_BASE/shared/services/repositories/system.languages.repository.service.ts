import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
//import { env } from "process";
import { GenericRepositoryServiceBase } from "./base/generic-repository.service.base";
import { DiagnosticsTraceService } from "../diagnostics.service";
import { EnvironmentService } from "../environment.service";
import { ErrorService } from "../error.service";
import { TypeService } from "../type.service";
// import models:
import { SystemLanguage } from "../../models/data/system-language";
import { Observable, catchError, retry } from "rxjs";
import { ObjectMappingService } from "../objectMapping.service";
// Constants:
import { SystemQueryEndpoints } from "../../constants/systemQueryEndpoints";
import { SessionStorageService } from "../SessionStorageService";
import { UrlService } from "../url.service";


@Injectable({ providedIn: 'root' })
export class SystemLanguagesRepositoryService
  extends GenericRepositoryServiceBase<SystemLanguage> {

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
      SystemQueryEndpoints.base_languages
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
