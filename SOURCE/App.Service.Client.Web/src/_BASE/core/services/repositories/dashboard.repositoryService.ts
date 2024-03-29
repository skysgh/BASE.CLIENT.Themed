//
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
//
import { DiagnosticsTraceService } from "../diagnostics.service";
import { EnvironmentService } from "../environment.service";
import { ErrorService } from "../error.service";
import { ObjectMappingService } from "../objectMapping.service";
import { TypeService } from "../type.service";
import { MappedGenericRepositoryServiceBase } from "./base/mapped-generic-repository.service.base";
// Constants:
import { system as importedSystemConst } from '../../constants/system';
// Services:
import { SessionStorageService } from "../SessionStorageService";
import { UrlService } from "../url.service";
import { SimpleGenericRepositoryServiceBase } from "./base/simple-generic-repository-service.base";
// Models/Data:
import { Stat } from "../../models/data/stat.model";

/**
 * Stateless service to manage interactions with
 * an API provided by the service
 * for Stat.
 * Being stateless, ok to have only one instance, so registere in the root:
 */
@Injectable({ providedIn: 'root' })
export class DashboardRepositoryService
  extends SimpleGenericRepositoryServiceBase<Stat>{

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
  
      importedSystemConst.apis.systemNotifications
    );
  }

}
