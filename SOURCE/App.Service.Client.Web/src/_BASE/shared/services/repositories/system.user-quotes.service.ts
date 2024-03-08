import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
//import { env } from "process";
import { GenericRepositoryServiceBase } from "./base/generic-repository.service.base";
import { DiagnosticsService } from "../diagnostics.service";
import { EnvironmentService } from "../environment.service";
import { ErrorService } from "../error.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TypeService } from "../type.service";
import { UserQuote } from "../../models/data/user-quote.model";
// import models:


@Injectable({ providedIn: 'root' })
export class SystemUserQuoteRepositoryService
  extends GenericRepositoryServiceBase<UserQuote> {

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
      "userQuotes"
    );
  }
  getAllByLanguageCode(langCode:'en', page: number = 0): Observable<UserQuote> {
    var url: string
      = this.buildRequestUrl(
      this.isJsonServer
        ? `?languageCode ${langCode}&_page=${page}&_per_page=20`
        : 'TODO');

    this.diagnosticsService.info(`querying: GET: ${url}`);

    var result =
      this.http
        .get<UserQuote>(url)
        .pipe(
          retry(1),
          catchError(this.handleError)
        );

    this.diagnosticsService.info(result);
    return result;
  }

}
