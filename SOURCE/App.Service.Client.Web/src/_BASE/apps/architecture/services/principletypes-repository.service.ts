//import { env } from "process";
import { GenericRepositoryService } from "../../../shared/services/repositories/generic-repository.service";
import { DiagnosticsService } from "../../../shared/services/diagnostics.service";
import { EnvironmentService } from "../../../shared/services/environment.service";
import { ErrorService } from "../../../shared/services/error.service";
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
