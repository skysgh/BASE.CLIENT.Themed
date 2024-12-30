// Rx:
//
// Ag:
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// Constants:
import { system as importedSystemConst } from '../../../../core/constants/system';
// Services:
import { MappedGenericRepositoryServiceBase } from "../../../../core/services/repositories/base/mapped-generic-repository.service.base";
// Models:
import { Spike } from "../../models/spike.model";
import { RepositoryStandardServicesPackage } from "../../../../core/services/repositories/base/_standard-repository-services-package";

@Injectable()
export class BaseAppsSpikeSpikesRepositoryService
  extends MappedGenericRepositoryServiceBase<Spike,Spike> {
  // Make system/env variables avaiable to class & view template:
  // already inherited: public system = importedSystemConst;



  constructor(
    repositoryStandardServicesPackage: RepositoryStandardServicesPackage,
    httpClient: HttpClient) {
    super(
      repositoryStandardServicesPackage,
      httpClient,
    // Constants:
      "spikes"
    );
  }

  /**
 * Map incoming TDto to a TVto more appropriate for the UI.
 * TODO: need to use the proper service to do this kind of work.
 * @param dto
 * @returns
 */
  protected override MapObjectTo(dto: Spike): Spike {
    //this.objectMappingService.map(dto..., ...);
    return ((dto as unknown) as Spike);
  }
  /**
 * Map TVto back to a TDto more appropriate for saving/updating in a db.
 * TODO: need to use the proper service to do this kind of work.
 * @param dto
 * @returns
 */
  protected override MapObjectFrom(vto: Spike): Spike {
    //this.objectMappingService.map(dto..., ...);
    return ((vto as unknown) as Spike);
  }

}
