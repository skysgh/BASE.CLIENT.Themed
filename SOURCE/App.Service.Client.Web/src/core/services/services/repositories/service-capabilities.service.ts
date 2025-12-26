// Rx:
//
// Ag:
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// Etc:
//
// Constants:

// Services:
import { RepositoryStandardServicesPackage } from '../../repositories/base/_standard-repository-services-package';
//import { env } from "process";
import { SimpleGenericRepositoryServiceBase } from '../../repositories/base/simple-generic-repository-service.base';
// Models:
import { SystemCapabilitiesVTO } from '../../../../core/models/view/system-capabilities.vto.model';
import { appsConfiguration } from '../../../../sites.app/configuration/implementations/apps.configuration';

/**
 * Stateless service to manage interactions with
 * an API provided by the service
 * for system user quotes.
 * Being stateless, ok to have only one instance, so registere in the root:
 */

@Injectable({ providedIn: 'root' })
export class SystemCapabilitiesRepositoryService
  extends SimpleGenericRepositoryServiceBase<SystemCapabilitiesVTO> {

  constructor(
    repositoryStandardServicesPackage: RepositoryStandardServicesPackage,
    httpClient: HttpClient) {
    super(
      repositoryStandardServicesPackage,
      httpClient,
      appsConfiguration.others.sites.constants.apis.brochure.capabilities
    );
  }
}
