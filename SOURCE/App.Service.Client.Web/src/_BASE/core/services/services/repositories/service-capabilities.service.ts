// Rx:
//
// Ag:
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// Etc:
//
// Constants:
import { system as importedSystemConst } from '../../../constants/system';
// Services:
import { RepositoryStandardServicesPackage } from '../../repositories/base/_standard-repository-services-package';
//import { env } from "process";
import { SimpleGenericRepositoryServiceBase } from '../../repositories/base/simple-generic-repository-service.base';
// Models:
import { SystemCapabilitiesVTO } from '../../../models/view/system-capabilities.vto.model';

/**
 * Stateless service to manage interactions with
 * an API provided by the service
 * for system user quotes.
 * Being stateless, ok to have only one instance, so registere in the root:
 */

@Injectable({ providedIn: 'root' })
export class SystemCapabilitiesRepositoryService
  extends SimpleGenericRepositoryServiceBase<SystemCapabilitiesVTO> {
  // Make system/env variables avaiable to class & view template:
  // already defined in superclass: public system = importedSystemConst;

  constructor(
    repositoryStandardServicesPackage: RepositoryStandardServicesPackage,
    httpClient: HttpClient) {
    super(
      repositoryStandardServicesPackage,
      httpClient,
      importedSystemConst.apis.base.service.capabilities
    );
  }
}
