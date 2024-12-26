import { IHasTenancyId } from "../../../models/contracts/IHasTenancyId";
import { MappedGenericRepositoryServiceBase } from "./mapped-generic-repository.service.base";

/** Service to retrieve entities specific to a Service.Id */

export abstract class TenancySpecificMappedGenericRepositoryServiceBase<TDto extends IHasTenancyId, TVto>
    extends MappedGenericRepositoryServiceBase<TDto, TVto> {
}
