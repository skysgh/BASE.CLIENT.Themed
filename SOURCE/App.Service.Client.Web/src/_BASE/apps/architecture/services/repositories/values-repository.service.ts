//import { env } from "process";
import { GenericRepositoryServiceBase } from "../../../shared/services/repositories/generic-repository.service";
import { DiagnosticsService } from "../../../shared/services/diagnostics.service";
import { EnvironmentService } from "../../../shared/services/environment.service";
import { ErrorService } from "../../../shared/services/error.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// import models:
import { Value } from "../models/value.model";


@Injectable()
export class ArchitectureValuesRepositoryService
  extends GenericRepositoryServiceBase<Value> {

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
      "values"
    );
  }
}
