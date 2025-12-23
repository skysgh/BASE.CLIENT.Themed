//Rx:
//
// Ag:
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// Etc:
//
// Constants:
//
// Services:
import { SimpleGenericRepositoryServiceBase } from "../../../../core/services/repositories/base/simple-generic-repository-service.base";
import { RepositoryStandardServicesPackage } from "../../../../core/services/repositories/base/_standard-repository-services-package";
import { ServiceStat } from "../../../../core/models/data/service-stat.model";
import { appsConfiguration } from "../../../../apps/configuration/implementations/apps.configuration";
// Models/Data:
//import { ServiceStat } from "../../../models/data/service-stat.model";

/**
 * Stateless service to manage interactions with
 * an API provided by the service
 * for Stat.
 * Being stateless, ok to have only one instance, so registere in the root:
 */
@Injectable({ providedIn: 'root' })
export class DashboardRepositoryService
  extends SimpleGenericRepositoryServiceBase<ServiceStat>{

  constructor(
    repositoryStandardServicesPackage: RepositoryStandardServicesPackage,
    httpClient: HttpClient) {
    super(
      repositoryStandardServicesPackage,
      httpClient,
      appsConfiguration.others.sites.constants.apis.service.notifications
    );
  }

}
