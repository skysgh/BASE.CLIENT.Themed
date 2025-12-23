// Ag:
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// Constants:

// Services:
//import { MappedGenericRepositoryServiceBase } from "./base/mapped-generic-repository.service.base";
import { SimpleGenericRepositoryServiceBase } from "./base/simple-generic-repository-service.base";
import { RepositoryStandardServicesPackage } from "./base/_standard-repository-services-package";
//Models:
import { Job } from "../../models/data/job.model";
import { appsConfiguration } from "../../../apps/configuration/implementations/apps.configuration";

/**
 * Stateless service to manage interactions with
 * an API provided by the service
 * for Job openings.
 * Being stateless, ok to have only one instance, so registere in the root:
 */
@Injectable({ providedIn: 'root' })

export class JobRepositoryService
  extends SimpleGenericRepositoryServiceBase<Job> {

  constructor(
    repositoryStandardServicesPackage: RepositoryStandardServicesPackage,
    httpClient: HttpClient) {
    super(
      repositoryStandardServicesPackage,
      httpClient,
      appsConfiguration.others.sites.constants.apis.brochure.jobs
    );
    // Make system/env variables avaiable to view template (via singleton or service):
    
  }
}
