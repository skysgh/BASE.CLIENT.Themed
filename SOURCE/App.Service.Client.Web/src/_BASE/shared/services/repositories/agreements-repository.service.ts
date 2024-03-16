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


/**
 * Stateless service to manage interactions with
 * an API provided by the service
 * for Agreements (eg: Terms&Conditions)
 * Being stateless, ok to have only one instance, so registere in the root:
 */
@Injectable({ providedIn: 'root' })
export class AgreementsRepositoryService
  extends GenericRepositoryServiceBase<Agreement, Agreement> {

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
  /**
   * Map incoming TDto to a TVto more appropriate for the UI.
   * TODO: need to use the proper service to do this kind of work.
   * @param dto
   * @returns
   */
  protected override MapObjectTo(dto: any): any {
    //this.objectMappingService.map(dto..., ...);
    return ((dto as unknown) as any);
  }
  /**
   * Map TVto back to a TDto more appropriate for saving/updating in a db.
   * TODO: need to use the proper service to do this kind of work.
   * @param dto
   * @returns
   */
  protected override MapObjectFrom(vto: any): any {
    //this.objectMappingService.map(dto..., ...);
    return ((vto as unknown) as any);
  }
}
