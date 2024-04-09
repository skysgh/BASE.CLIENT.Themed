import { IHasServiceId } from "../../../models/contracts/IHasServiceId";
import { MappedGenericRepositoryServiceBase } from "./mapped-generic-repository.service.base";


/** Service to retrieve mappable entities, specific to a Service.Id */
export abstract class ServiceSpecificMappedGenericRepositoryServiceBase<TDto extends IHasServiceId, TVto>
  extends MappedGenericRepositoryServiceBase<TDto, TVto> {
  // Make system/env variables avaiable to class & view template:
  // already defined in superclass: public system = importedSystemConst;


}
