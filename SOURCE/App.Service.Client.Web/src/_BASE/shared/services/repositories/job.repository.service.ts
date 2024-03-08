import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { DiagnosticsService } from "../diagnostics.service";
import { EnvironmentService } from "../environment.service";
import { ErrorService } from "../error.service";
import { TypeService } from "../type.service";
import { GenericRepositoryServiceBase } from "./base/generic-repository.service.base";
import { Job } from "../../models/data/job.model";

@Injectable({ providedIn: 'root' })
export class JobRepositoryService
  extends GenericRepositoryServiceBase<Job> {

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
      "jobs"
    );
  }
}
