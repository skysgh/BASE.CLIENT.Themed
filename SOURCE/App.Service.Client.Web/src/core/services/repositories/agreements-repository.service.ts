import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

// Constants:

// Services:
//import { MappedGenericRepositoryServiceBase } from "./base/mapped-generic-repository.service.base";
import { SimpleGenericRepositoryServiceBase } from "./base/simple-generic-repository-service.base";
import { RepositoryStandardServicesPackage } from "./base/_standard-repository-services-package";
// Models:
import { Agreement } from "../../models/agreement.model";
import { appsConfiguration } from "../../../apps/configuration/implementations/apps.configuration";


/**
 * Stateless service to manage interactions with
 * an API provided by the service
 * for Agreements (eg: Terms&Conditions)
 * Being stateless, ok to have only one instance, so registere in the root:
 */
@Injectable({ providedIn: 'root' })
export class AgreementsRepositoryService
  extends SimpleGenericRepositoryServiceBase<Agreement> {
  //already defined in superclass: system = importedSystemConst;
  constructor(
    repositoryStandardServicesPackage: RepositoryStandardServicesPackage,
     httpClient: HttpClient) {
    super(
      repositoryStandardServicesPackage,
      httpClient,
      // Constants:
      appsConfiguration.constants.apis.todo.agreements
    );
  }
}
