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
import { ServiceFaq } from "../../../models/data/service-faq.model";
import { appsConfiguration } from '../../../../sites.app/configuration/implementations/apps.configuration';

/**
 * Stateless service to manage interactions with
 * an API provided by the service
 * for Job openings.
 * Being stateless, ok to have only one instance, so registere in the root:
 */
@Injectable({ providedIn: 'root' })

export class ServiceFaqsRepositoryService
  extends SimpleGenericRepositoryServiceBase<ServiceFaq> {

  constructor(
    repositoryStandardServicesPackage: RepositoryStandardServicesPackage,
    httpClient: HttpClient) {
    super(
      repositoryStandardServicesPackage,
      httpClient,
      appsConfiguration.others.sites.constants.apis.brochure.faqs
    );
    // Make system/env variables avaiable to view template (via singleton or service):
    
  }
}
