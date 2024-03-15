//import { env } from "process";
import { GenericRepositoryServiceBase } from "../../../../shared/services/repositories/base/generic-repository.service.base";
import { DiagnosticsTraceService } from "../../../../shared/services/diagnostics.service";
import { EnvironmentService } from "../../../../shared/services/environment.service";
import { ErrorService } from "../../../../shared/services/error.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// import models:
import { PrincipleType } from "../../models/principle-type.model";
import { TypeService } from "../../../../shared/services/type.service";
import { SessionStorageService } from "../../../../shared/services/SessionStorageService";
import { ObjectMappingService } from "../../../../shared/services/objectMapping.service";
import { UrlService } from "../../../../shared/services/url.service";


@Injectable()
export class ArchitectureValuesRepositoryService
  extends GenericRepositoryServiceBase<PrincipleType> {

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
      "principleTypes"
    );
  }
}
