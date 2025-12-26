// Rx:
//
// Angular:
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// Constants:

// Services:
import { SimpleGenericRepositoryServiceBase } from '../../repositories/base/simple-generic-repository-service.base';
import { RepositoryStandardServicesPackage } from "../../repositories/base/_standard-repository-services-package";
// Models:
import { ServiceNotification } from "../../../models/data/service-notification.model";
import { Observable } from "rxjs";
import { appsConfiguration } from '../../../../sites.app/configuration/implementations/apps.configuration";


/**
 * Stateless service to manage interactions with
 * an API provided by the service
 * for Notifications.
 * Being stateless, ok to have only one instance, so registere in the root:
 */

@Injectable({ providedIn: 'root' })
export class NotificationsRepositoryService
  extends SimpleGenericRepositoryServiceBase<ServiceNotification> {
  constructor(
    repositoryStandardServicesPackage: RepositoryStandardServicesPackage,
    httpClient: HttpClient) {
    super(
      repositoryStandardServicesPackage,
      httpClient,
      appsConfiguration.others.sites.constants.apis.service.notifications
    );
  }

  public override getPage(page: number = 0): Observable<ServiceNotification[]> {
    var url = this.buildEnabledPagedRequestUrl(page);
    url = this.appendFKFilter(url, "00000000-0000-0000-0000-000000000002",'forUserFK');
    return this.makeListRequest(url);
  }






}
