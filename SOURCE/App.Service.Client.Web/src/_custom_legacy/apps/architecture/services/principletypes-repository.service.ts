//import { env } from "process";
import { GenericRepositoryServiceBase } from "../../../common/services/repositories/generic-repository.service";
import { DiagnosticsService } from "../../../common/services/diagnostics.service";
import { EnvironmentService } from "../../../common/services/environment.service";
import { ErrorService } from "../../../common/services/error.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// import models:
import { PrincipleType } from "../models/principle-type.model";
import { TypeService } from "../../../../_BASE/shared/services/type.service";


@Injectable()
export class ArchitectureValuesRepositoryService
  extends GenericRepositoryServiceBase<PrincipleType> {

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
      "principleTypes"
    );
  }
}
