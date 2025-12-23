// Rx:
//
// Ag:
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// Constants:

// Services:
import { RepositoryStandardServicesPackage } from "../../repositories/base/_standard-repository-services-package";
import { SimpleGenericRepositoryServiceBase } from "../../repositories/base/simple-generic-repository-service.base";
// Models:
import { ServiceEndorsementMAYBE } from "../../../models/data/service-endorsement.model";
import { appsConfiguration } from "../../../../apps/configuration/implementations/apps.configuration";

/**
 * Stateless service to manage interactions with
 * an API provided by the service
 * for Job openings.
 * Being stateless, ok to have only one instance, so registere in the root:
 *
 * The difference between 'endorsements' and 'trustedby' is one is by
 * users (quotes, no logo), and the other by
 * companies (generally just a logo).
 */
@Injectable({ providedIn: 'root' })

export class SystemEndorsementRepositoryService
  extends SimpleGenericRepositoryServiceBase<ServiceEndorsementMAYBE> {

  constructor(
    repositoryStandardServicesPackage: RepositoryStandardServicesPackage,
    httpClient: HttpClient) {
    super(
      repositoryStandardServicesPackage,
      httpClient,
      appsConfiguration.others.sites.constants.apis.brochure.endorsements
    );
    // Make system/env variables avaiable to view template (via singleton or service):
    
  }
}
