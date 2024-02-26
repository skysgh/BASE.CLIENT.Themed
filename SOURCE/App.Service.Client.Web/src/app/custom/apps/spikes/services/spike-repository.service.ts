//import { env } from "process";
import { GenericRepositoryService } from "../../../common/services/generic-repository.service";
import { Spike } from "../models/spike.model";
import { DiagnosticsService } from "../../../common/services/diagnostics.service";
import { EnvironmentService } from "../../../common/services/environment.service";
import { ErrorService } from "../../../common/services/error.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class SpikeSpikesRepositoryService
  extends GenericRepositoryService<Spike> {

  constructor(
    environmentService: EnvironmentService,
    diagnosticsService: DiagnosticsService,
    errorService: ErrorService,
    httpClient: HttpClient) {
    super(
      environmentService,
      diagnosticsService,
      errorService,
      httpClient,
      "spikes"
    );
  }
}
