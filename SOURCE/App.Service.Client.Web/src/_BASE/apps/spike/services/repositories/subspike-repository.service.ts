// Rx:
// ..
// Ag:
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// Constants:
import { system as importedSystemConst } from '../../../../core/constants/system';
// Services:
import { MappedGenericRepositoryServiceBase } from "../../../../core/services/repositories/base/mapped-generic-repository.service.base";
import { RepositoryStandardServicesPackage } from "../../../../core/services/repositories/base/_standard-repository-services-package";
// Models:
import { SubSpike } from "../../models/subspike.model";


@Injectable()
export class BaseAppsSpikeSubSpikesRepositoryService
  extends MappedGenericRepositoryServiceBase<SubSpike,SubSpike> {
  // Make system/env variables avaiable to class & view template:
  // already defined in superclass: public system = importedSystemConst;

  constructor(
    repositoryStandardServicesPackage: RepositoryStandardServicesPackage,
    httpClient: HttpClient) {
    super(
      repositoryStandardServicesPackage,
      httpClient,
    // Constants:
      "subSpikes"
    );

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)

  }

  /**
* Map incoming TDto to a TVto more appropriate for the UI.
* TODO: need to use the proper service to do this kind of work.
* @param dto
* @returns
*/
  protected override MapObjectTo(dto: SubSpike): SubSpike {
    //this.objectMappingService.map(dto..., ...);
    return ((dto as unknown) as SubSpike);
  }
  /**
 * Map TVto back to a TDto more appropriate for saving/updating in a db.
 * TODO: need to use the proper service to do this kind of work.
 * @param dto
 * @returns
 */
  protected override MapObjectFrom(vto: SubSpike): SubSpike {
    //this.objectMappingService.map(dto..., ...);
    return ((vto as unknown) as SubSpike);
  }
}
