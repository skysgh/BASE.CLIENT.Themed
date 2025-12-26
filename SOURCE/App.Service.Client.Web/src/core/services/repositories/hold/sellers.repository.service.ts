// Ag:
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// Etc:
//
// Constants:

// Services:
import { SimpleGenericRepositoryServiceBase } from "../base/simple-generic-repository-service.base";
import { RepositoryStandardServicesPackage } from "../base/_standard-repository-services-package";
import { appsConfiguration } from '../../../../sites.app/configuration/implementations/apps.configuration";
// Models:
// TODO

@Injectable({ providedIn: 'root' })
export class SellersRepositoryService
  extends SimpleGenericRepositoryServiceBase<any>{

  constructor(
    repositoryStandardServicesPackage: RepositoryStandardServicesPackage,
    httpClient: HttpClient) {
    super(
      repositoryStandardServicesPackage,
      httpClient,
      appsConfiguration.constants.apis.transactions
    );
  }

}
