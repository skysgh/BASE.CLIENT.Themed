//import { env } from "process";
import { GenericRepositoryService } from "../../../common/services/generic-repository.service";
import { DiagnosticsService } from "../../../common/services/diagnostics.service";
import { EnvironmentService } from "../../../common/services/environment.service";
import { ErrorService } from "../../../common/services/error.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// import models:
import { PrincipleType } from "../models/principle-type.model";


@Injectable()
export class ArchitectureValuesRepositoryService
  extends GenericRepositoryService<PrincipleType> {

  constructor(
    environmentService: EnvironmentService,
    diagnosticsService: DiagnosticsService,
    errorService: ErrorService,
    httpClient: HttpClient) {
    super(
      environmentService,
      diagnosticsService,
      errorService,
      httpClient,
      "principleTypes"
    );
  }
}
