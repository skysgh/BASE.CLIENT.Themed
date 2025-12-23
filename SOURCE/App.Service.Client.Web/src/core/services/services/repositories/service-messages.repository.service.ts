// Rx:
//import { Observable, catchError, retry } from "rxjs";
// Ag:
//import { HttpClient } from "@angular/common/http";
//import { Injectable } from "@angular/core";
// Constants:
//
// Services:
//import { MappedGenericRepositoryServiceBase } from "./base/generic-repository.service.base";
//import { ServiceNotification } from "../../models/data/service-notification.model";
//import { Message } from "../../models/data/message.model";
// Constants:
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
//  extends SimpleGenericRepositoryServiceBase<Message> {

//  constructor(
//repositoryStandardServicesPackage: RepositoryStandardServicesPackage,
//  httpClient: HttpClient) {
//  super(
//    repositoryStandardServicesPackage,
//    httpClient,
//      appsConfiguration.constants.base.service.notifications
//    );
//  }

//  protected override buildPagedRequestUrl(page: number): string {

//    var userId = "00000000-0000-0000-0000-000000000002";

//    return this.buildRequestUrl(this.isJsonServer ? `?_enabled=true&_userFK=${userId}&_page=${page}&_per_page=20` : 'TODO');
//  }



//}
