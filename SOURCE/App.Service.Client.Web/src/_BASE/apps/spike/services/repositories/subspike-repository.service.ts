import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
//import { env } from "process";
import { MappedGenericRepositoryServiceBase } from "../../../../core/services/repositories/base/mapped-generic-repository.service.base";
import { DiagnosticsTraceService } from "../../../../core/services/diagnostics.service";
import { EnvironmentService } from "../../../../core/services/environment.service";
import { ErrorService } from "../../../../core/services/error.service";
import { SubSpike } from "../../models/subspike.model";
import { TypeService } from "../../../../core/services/type.service";
import { SessionStorageService } from "../../../../core/services/SessionStorageService";
import { ObjectMappingService } from "../../../../core/services/objectMapping.service";
import { UrlService } from "../../../../core/services/url.service";

@Injectable()
export class BaseAppsSpikeSubSpikesRepositoryService
  extends MappedGenericRepositoryServiceBase<SubSpike,SubSpike> {

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
      "subSpikes"
    );
  }

  /**
* Map incoming TDto to a TVto more appropriate for the UI.
* TODO: need to use the proper service to do this kind of work.
* @param dto
* @returns
*/
  protected override MapObjectTo(dto: SubSpike): SubSpike {
    //this.objectMappingService.map(dto..., ...);
    return ((dto as unknown) as SubSpike);
  }
  /**
 * Map TVto back to a TDto more appropriate for saving/updating in a db.
 * TODO: need to use the proper service to do this kind of work.
 * @param dto
 * @returns
 */
  protected override MapObjectFrom(vto: SubSpike): SubSpike {
    //this.objectMappingService.map(dto..., ...);
    return ((vto as unknown) as SubSpike);
  }
}
