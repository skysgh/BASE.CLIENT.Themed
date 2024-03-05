//import { env } from "process";
import { GenericRepositoryServiceBase } from "../../../../shared/services/repositories/generic-repository.service.base";
import { Spike } from "../../models/spike.model";
import { DiagnosticsService } from "../../../../shared/services/diagnostics.service";
import { EnvironmentService } from "../../../../shared/services/environment.service";
import { ErrorService } from "../../../../shared/services/error.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TypeService } from "../../../../shared/services/type.service";

@Injectable()
export class BaseAppsSpikeSpikesRepositoryService
  extends GenericRepositoryServiceBase<Spike> {

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
      "spikes"
    );
  }
}
