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

@Injectable({ providedIn: 'root' })
export class InvoicesRepositoryService
  extends GenericRepositoryServiceBase<any> {

  constructor(
    typeService: TypeService,
    environmentService: EnvironmentService,
    diagnosticsTraceService: DiagnosticsTraceService,
    errorService: ErrorService,
    objectMappingService: ObjectMappingService,
    sessionStorageService: SessionStorageService,
    httpClient: HttpClient) {
    super(
      typeService,
      environmentService,
      diagnosticsTraceService,
      errorService,
      objectMappingService,
      sessionStorageService,
      httpClient,
      SystemQueryEndpoints.transactions
    );
  }
}
