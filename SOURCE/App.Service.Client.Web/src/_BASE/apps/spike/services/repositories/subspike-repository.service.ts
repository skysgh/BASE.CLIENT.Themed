import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
//import { env } from "process";
import { GenericRepositoryServiceBase } from "../../../../shared/services/repositories/generic-repository.service.base";
import { DiagnosticsService } from "../../../../shared/services/diagnostics.service";
import { EnvironmentService } from "../../../../shared/services/environment.service";
import { ErrorService } from "../../../../shared/services/error.service";
import { SubSpike } from "../../models/subspike.model";
import { TypeService } from "../../../../shared/services/type.service";

@Injectable()
export class BaseAppsSpikeSubSpikesRepositoryService
  extends GenericRepositoryServiceBase<SubSpike> {

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
      "subSpikes"
    );
  }
}
