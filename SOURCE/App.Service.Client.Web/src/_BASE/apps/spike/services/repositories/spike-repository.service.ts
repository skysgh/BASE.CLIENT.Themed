//import { env } from "process";
import { MappedGenericRepositoryServiceBase } from "../../../../core/services/repositories/base/mapped-generic-repository.service.base";
import { Spike } from "../../models/spike.model";
import { DiagnosticsTraceService } from "../../../../core/services/diagnostics.service";
import { EnvironmentService } from "../../../../core/services/environment.service";
import { ErrorService } from "../../../../core/services/error.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TypeService } from "../../../../core/services/type.service";
import { ObjectMappingService } from "../../../../core/services/objectMapping.service";
import { SessionStorageService } from "../../../../core/services/SessionStorageService";
import { UrlService } from "../../../../core/services/url.service";
//import { Session } from "inspector";

@Injectable()
export class BaseAppsSpikeSpikesRepositoryService
  extends MappedGenericRepositoryServiceBase<Spike,Spike> {

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

  /**
 * Map incoming TDto to a TVto more appropriate for the UI.
 * TODO: need to use the proper service to do this kind of work.
 * @param dto
 * @returns
 */
  protected override MapObjectTo(dto: Spike): Spike {
    //this.objectMappingService.map(dto..., ...);
    return ((dto as unknown) as Spike);
  }
  /**
 * Map TVto back to a TDto more appropriate for saving/updating in a db.
 * TODO: need to use the proper service to do this kind of work.
 * @param dto
 * @returns
 */
  protected override MapObjectFrom(vto: Spike): Spike {
    //this.objectMappingService.map(dto..., ...);
    return ((vto as unknown) as Spike);
  }

}
