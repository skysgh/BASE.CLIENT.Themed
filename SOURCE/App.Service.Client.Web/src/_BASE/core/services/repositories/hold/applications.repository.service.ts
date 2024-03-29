// Ag:
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// Etc:
// 
// Constants:
import { system as importedSystemConst } from '../../../constants/system';
// Services:
import { DiagnosticsTraceService } from "../../diagnostics.service";
import { EnvironmentService } from "../../environment.service";
import { ErrorService } from "../../error.service";
import { ObjectMappingService } from "../../objectMapping.service";
import { TypeService } from "../../type.service";
import { MappedGenericRepositoryServiceBase } from "../base/mapped-generic-repository.service.base";
import { SessionStorageService } from "../../SessionStorageService";
import { UrlService } from "../../url.service";
import { SimpleGenericRepositoryServiceBase } from "../base/simple-generic-repository-service.base";

@Injectable({ providedIn: 'root' })
export class ApplicationsRepositoryService
  extends SimpleGenericRepositoryServiceBase<any> {

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
      importedSystemConst.apis.transactions
    );
  }

}
