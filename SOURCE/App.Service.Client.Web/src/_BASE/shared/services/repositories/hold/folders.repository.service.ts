//
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
//
import { DiagnosticsTraceService } from "../../diagnostics.service";
import { EnvironmentService } from "../../environment.service";
import { ErrorService } from "../../error.service";
import { ObjectMappingService } from "../../objectMapping.service";
import { TypeService } from "../../type.service";
import { GenericRepositoryServiceBase } from "../base/generic-repository.service.base";
//
import { SystemQueryEndpoints } from "../../../constants/systemQueryEndpoints";
import { SessionStorageService } from "../../SessionStorageService";
import { UrlService } from "../../url.service";

@Injectable({ providedIn: 'root' })
export class FoldersRepositoryService
  extends GenericRepositoryServiceBase<any, any> {

  constructor(
    typeService: TypeService,
    environmentService: EnvironmentService,
    diagnosticsTraceService: DiagnosticsTraceService,
    errorService: ErrorService,
    objectMappingService: ObjectMappingService,
    sessionStorageService: SessionStorageService,
    urlService: UrlService,
    httpClient: HttpClient
    ) {
    super(
      typeService,
      environmentService,
      diagnosticsTraceService,
      errorService,
      objectMappingService,
      sessionStorageService,
      urlService,
      httpClient,
      SystemQueryEndpoints.transactions
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
