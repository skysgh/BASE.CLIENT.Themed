//import { env } from "process";
import { GenericRepositoryServiceBase } from "../../../../shared/services/repositories/base/generic-repository.service.base";
import { Spike } from "../../models/spike.model";
import { DiagnosticsTraceService } from "../../../../shared/services/diagnostics.service";
import { EnvironmentService } from "../../../../shared/services/environment.service";
import { ErrorService } from "../../../../shared/services/error.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TypeService } from "../../../../shared/services/type.service";
import { ObjectMappingService } from "../../../../shared/services/objectMapping.service";
import { SessionStorageService } from "../../../../shared/services/SessionStorageService";
import { UrlService } from "../../../../shared/services/url.service";
//import { Session } from "inspector";

@Injectable()
export class BaseAppsSpikeSpikesRepositoryService
  extends GenericRepositoryServiceBase<Spike> {

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
      "spikes"
    );
  }
}
