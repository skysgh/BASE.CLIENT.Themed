//import { env } from "process";
import { GenericRepositoryServiceBase } from "./base/generic-repository.service.base";
import { DiagnosticsService } from "../../../shared/services/diagnostics.service";
import { EnvironmentService } from "../../../shared/services/environment.service";
import { ErrorService } from "../../../shared/services/error.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

// import models:
import { Agreement } from "../../../core/models/agreement.model";
import { TypeService } from "../type.service";


@Injectable({ providedIn: 'root' })
export class NotificationsRepositoryService
  extends GenericRepositoryServiceBase<Agreement> {

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
      "agreements"
    );
  }
}
