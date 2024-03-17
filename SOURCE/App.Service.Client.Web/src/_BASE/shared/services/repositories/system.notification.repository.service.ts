import { Observable, catchError, retry } from "rxjs";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { MappedGenericRepositoryServiceBase } from "./base/mapped-generic-repository.service.base";
import { DiagnosticsTraceService } from "../diagnostics.service";
import { EnvironmentService } from "../environment.service";
import { ErrorService } from "../error.service";

import { TypeService } from "../type.service";
import { SystemNotification } from "../../models/data/notification.model";
import { ObjectMappingService } from "../objectMapping.service";
// Constants:
import { SystemQueryEndpoints } from "../../constants/systemQueryEndpoints";
import { SessionStorageService } from "../SessionStorageService";
import { UrlService } from "../url.service";
import { SimpleGenericRepositoryServiceBase } from "./base/simple-generic-repository-service.base";
// import models:

/**
 * Stateless service to manage interactions with
 * an API provided by the service
 * for Notifications.
 * Being stateless, ok to have only one instance, so registere in the root:
 */

@Injectable({ providedIn: 'root' })
export class NotificationsRepositoryService
  extends SimpleGenericRepositoryServiceBase<SystemNotification> {

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
      SystemQueryEndpoints.systemNotifications
    );
  }

  protected override buildPagedRequestUrl(page: number): string {

    var userId = "00000000-0000-0000-0000-000000000002";

    var result = this.buildRequestUrl('', this.isJsonServer ? `?_enabled=true&_forUserFK=${userId}&_page=${page}&_per_page=20` : 'TODO');
    return result;
  }





}
