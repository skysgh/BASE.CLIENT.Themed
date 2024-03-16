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

/**
 * Stateless service to manage interactions with
 * an API provided by the service
 * for Messages between Users.
 * Being stateless, ok to have only one instance, so registere in the root:
 */

//@Injectable({ providedIn: 'root' })
//export class MessagesRepositoryService
//  extends GenericRepositoryServiceBase<Message,Message> {

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

//  /**
//   * Map incoming TDto to a TVto more appropriate for the UI.
//   * TODO: need to use the proper service to do this kind of work.
//   * @param dto
//   * @returns
//   */
//  protected override MapObject(dto: any): any {
//  //this.objectMappingService.map(dto..., ...);
//  return ((dto as unknown) as any);
//}
//  /**
//   * Map TVto back to a TDto more appropriate for saving/updating in a db.
//   * TODO: need to use the proper service to do this kind of work.
//   * @param dto
//   * @returns
//   */
//  protected override MapObjectFrom(vto: any): any {
//  //this.objectMappingService.map(dto..., ...);
//  return ((vto as unknown) as any);
//}


//}
