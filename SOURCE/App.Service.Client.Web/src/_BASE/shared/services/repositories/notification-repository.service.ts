//import { env } from "process";
import { GenericRepositoryServiceBase } from "./generic-repository.service.base";
import { DiagnosticsService } from "../../../shared/services/diagnostics.service";
import { EnvironmentService } from "../../../shared/services/environment.service";
import { ErrorService } from "../../../shared/services/error.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TypeService } from "../type.service";
// import models:


@Injectable()
export class NotificationsRepositoryService
  extends GenericRepositoryServiceBase<Notification> {

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
      "notifications"
    );
  }
}
