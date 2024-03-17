//import { env } from "process";
import { MappedGenericRepositoryServiceBase } from "./base/mapped-generic-repository.service.base";
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
import { SimpleGenericRepositoryServiceBase } from "./base/simple-generic-repository-service.base";


/**
 * Stateless service to manage interactions with
 * an API provided by the service
 * for Agreements (eg: Terms&Conditions)
 * Being stateless, ok to have only one instance, so registere in the root:
 */
@Injectable({ providedIn: 'root' })
export class AgreementsRepositoryService
  extends SimpleGenericRepositoryServiceBase<Agreement> {

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
