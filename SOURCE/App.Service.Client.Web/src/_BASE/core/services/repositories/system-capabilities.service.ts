// Ag:
// Etc:
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';

// Constants:
import { system as importedSystemConst } from '../../constants/system';
// Services:
//import { env } from "process";
import { MappedGenericRepositoryServiceBase } from "./base/mapped-generic-repository.service.base";
import { DiagnosticsTraceService } from "../diagnostics.service";
import { EnvironmentService } from "../environment.service";
import { ErrorService } from "../error.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TypeService } from "../type.service";
import { ObjectMappingService } from '../objectMapping.service';
import { SessionStorageService } from '../SessionStorageService';
import { UrlService } from '../url.service';
import { TranslationService } from '../translation.service';
import { SimpleGenericRepositoryServiceBase } from './base/simple-generic-repository-service.base';
// Models/Data:
import { UserQuote } from "../../models/data/user-quote.model";
import { TeamVTO } from '../../models/view/team.vto';
import { CapabilitiesVTO } from '../../models/view/base-capabilities';
// import models:

/**
 * Stateless service to manage interactions with
 * an API provided by the service
 * for system user quotes.
 * Being stateless, ok to have only one instance, so registere in the root:
 */

@Injectable({ providedIn: 'root' })
export class SystemCapabilitiesRepositoryService
  extends SimpleGenericRepositoryServiceBase<CapabilitiesVTO> {

  constructor(
    typeService: TypeService,
    environmentService: EnvironmentService,
    diagnosticsTraceService: DiagnosticsTraceService,
    errorService: ErrorService,
    objectMappingService: ObjectMappingService,
    sessionStorageService: SessionStorageService,
    urlService: UrlService,
    private translationService: TranslationService,
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
      importedSystemConst.apis.base_capabilities

    );
  }
}
