import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { DiagnosticsTraceService } from "../diagnostics.service";
import { EnvironmentService } from "../environment.service";
import { ErrorService } from "../error.service";
import { TypeService } from "../type.service";
import { GenericRepositoryServiceBase } from "./base/generic-repository.service.base";
import { Job } from "../../models/data/job.model";
import { ObjectMappingService } from "../objectMapping.service";
// Constants:
import { SystemQueryEndpoints } from "../../constants/systemQueryEndpoints";
import { SessionStorageService } from "../SessionStorageService";
import { UrlService } from "../url.service";

@Injectable({ providedIn: 'root' })
export class JobRepositoryService
  extends GenericRepositoryServiceBase<Job> {

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
      SystemQueryEndpoints.jobs
    );
  }
}
