//import { Observable, catchError, retry } from "rxjs";

//import { HttpClient } from "@angular/common/http";
//import { Injectable } from "@angular/core";

//import { GenericRepositoryServiceBase } from "./base/generic-repository.service.base";
//import { DiagnosticsTraceService } from "../diagnostics.service";
//import { EnvironmentService } from "../environment.service";
//import { ErrorService } from "../error.service";

//import { TypeService } from "../type.service";
//import { SystemNotification } from "../../models/data/notification.model";
//import { Message } from "../../models/data/message.model";
//import { ObjectMappingService } from "../objectMapping.service";
//// Constants:
//import { SystemQueryEndpoints } from "../../constants/systemQueryEndpoints";
//// import models:


//@Injectable({ providedIn: 'root' })
//export class MessagesRepositoryService
//  extends GenericRepositoryServiceBase<Message> {

//  constructor(
//    typeService: TypeService,
//    environmentService: EnvironmentService,
//    diagnosticsTraceService: DiagnosticsTraceService,
//    errorService: ErrorService,
//    objectMappingService: ObjectMappingService,
//    httpClient: HttpClient) {
//    super(
//      typeService,
//      environmentService,
//      diagnosticsTraceService,
//      errorService,
//      objectMappingService,
//      httpClient,
//      SystemQueryEndpoints.systemNotifications
//    );
//  }

//  protected override buildPagedRequestUrl(page: number): string {

//    var userId = "00000000-0000-0000-0000-000000000002";

//    return this.buildRequestUrl(this.isJsonServer ? `?_enabled=true&_userFK=${userId}&_page=${page}&_per_page=20` : 'TODO');
//  }



//}
