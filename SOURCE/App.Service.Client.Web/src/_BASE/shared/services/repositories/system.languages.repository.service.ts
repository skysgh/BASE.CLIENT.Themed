import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
//import { env } from "process";
import { GenericRepositoryServiceBase } from "./base/generic-repository.service.base";
import { DiagnosticsService } from "../diagnostics.service";
import { EnvironmentService } from "../environment.service";
import { ErrorService } from "../error.service";
import { TypeService } from "../type.service";
// import models:
import { SystemLanguage } from "../../models/system-languages";
import { Observable, catchError, retry } from "rxjs";


@Injectable({ providedIn: 'root' })
export class SystemLanguagesRepositoryService
  extends GenericRepositoryServiceBase<SystemLanguage> {

  constructor(
    typeService: TypeService,
    environmentService: EnvironmentService,
    diagnosticsService: DiagnosticsService,
    errorService: ErrorService,
    httpClient: HttpClient) {
    super(
      typeService,
      environmentService,
      diagnosticsService,
      errorService,
      httpClient,
      "languageCodes"
    );
  }


  // HttpClient API get() method => Fetch entitys list
  getAllEnabled(page: number = 0): Observable<SystemLanguage[]> {
    var url: string = this.buildRequestUrl(this.isJsonServer ? `?enabled_ne=false&_page=${page}&_per_page=20` : 'TODO');
    this.diagnosticsService.info(`querying: GET: ${url}`);

    var result =
      this.http
        .get<SystemLanguage[]>(url)
        .pipe(
          retry(1),
          catchError(this.handleError)
        );

    this.diagnosticsService.info(result);
    return result;
  }


}
