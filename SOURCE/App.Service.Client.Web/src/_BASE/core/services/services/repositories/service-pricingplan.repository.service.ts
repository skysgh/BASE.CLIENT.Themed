// Rx:
//
// Ag:
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// Constants:
import { system as importedSystemConst } from '../../../constants/system';
// Services:
import { SimpleGenericRepositoryServiceBase } from "../../repositories/base/simple-generic-repository-service.base";
import { RepositoryStandardServicesPackage } from "../../repositories/base/_standard-repository-services-package";
// Models:
import { ServicePricingPlan } from "../../../models/data/service-pricing-plan.model";

/**
 * Stateless service to manage interactions with
 * an API provided by the service
 * for Job openings.
 * Being stateless, ok to have only one instance, so registere in the root:
 */
@Injectable({ providedIn: 'root' })

export class SystemPricingPlanRepositoryService
  extends SimpleGenericRepositoryServiceBase<ServicePricingPlan> {
  // Make system/env variables avaiable to class & view template:
  // already defined in superclass: public system = importedSystemConst;

  constructor(
    repositoryStandardServicesPackage: RepositoryStandardServicesPackage,
    httpClient: HttpClient) {
    super(
      repositoryStandardServicesPackage,
      httpClient,
      importedSystemConst.apis.base.service.pricingPlans
    );
    // Make system/env variables avaiable to view template (via singleton or service):
    // this.system = systemService.system;
  }
}


