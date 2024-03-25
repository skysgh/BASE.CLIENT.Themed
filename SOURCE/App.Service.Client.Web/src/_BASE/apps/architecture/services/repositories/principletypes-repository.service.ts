//import { env } from "process";
import { MappedGenericRepositoryServiceBase } from "../../../../core/services/repositories/base/mapped-generic-repository.service.base";
import { DiagnosticsTraceService } from "../../../../core/services/diagnostics.service";
import { EnvironmentService } from "../../../../core/services/environment.service";
import { ErrorService } from "../../../../core/services/error.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// import models:
import { PrincipleType } from "../../models/principle-type.model";
import { TypeService } from "../../../../core/services/type.service";
import { SessionStorageService } from "../../../../core/services/SessionStorageService";
import { ObjectMappingService } from "../../../../core/services/objectMapping.service";
import { UrlService } from "../../../../core/services/url.service";


@Injectable()
export class ArchitectureValuesRepositoryService
  extends MappedGenericRepositoryServiceBase<PrincipleType> {

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
