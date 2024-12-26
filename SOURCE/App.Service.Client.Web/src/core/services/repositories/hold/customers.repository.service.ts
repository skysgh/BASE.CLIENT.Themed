// Ag:
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// Etc:
//
// Constants:
import { system as importedSystemConst } from '../../../constants/system';
// Services:
import { SimpleGenericRepositoryServiceBase } from "../base/simple-generic-repository-service.base";
import { RepositoryStandardServicesPackage } from "../base/_standard-repository-services-package";
// Models:
// TODO

@Injectable({ providedIn: 'root' })
export class CustomersRepositoryService
  extends SimpleGenericRepositoryServiceBase<any> {

  constructor(
    repositoryStandardServicesPackage: RepositoryStandardServicesPackage,
    httpClient: HttpClient) {
    super(
      repositoryStandardServicesPackage,
      httpClient,
      importedSystemConst.apis.transactions
    );
  }


}
