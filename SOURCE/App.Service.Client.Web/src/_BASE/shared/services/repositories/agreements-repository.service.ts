//import { env } from "process";
import { GenericRepositoryServiceBase } from "./base/generic-repository.service.base";
import { DiagnosticsTraceService } from "../../../shared/services/diagnostics.service";
import { EnvironmentService } from "../../../shared/services/environment.service";
import { ErrorService } from "../../../shared/services/error.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

// import models:
import { Agreement } from "../../../core/models/agreement.model";
import { TypeService } from "../type.service";
import { ObjectMappingService } from "../objectMapping.service";
// Constants:
import { SystemQueryEndpoints } from "../../constants/systemQueryEndpoints";
import { SessionStorageService } from "../SessionStorageService";
import { UrlService } from "../url.service";


@Injectable({ providedIn: 'root' })
export class AgreementsRepositoryService
  extends GenericRepositoryServiceBase<Agreement> {

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
      // Constants:
      SystemQueryEndpoints.agreements
    );
  }
}
