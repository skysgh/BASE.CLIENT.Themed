import { IHasTenancyId } from "../../../models/contracts/IHasTenancyId";
import { SimpleGenericRepositoryServiceBase } from "./simple-generic-repository-service.base";
import { TenancySpecificMappedGenericRepositoryServiceBase } from "./tenancy-specific-mapped-generic-repository.service.base";

export abstract class TenancySpecificSimpleGenericRepositoryServiceBase<TDto extends IHasTenancyId>
  extends TenancySpecificMappedGenericRepositoryServiceBase<TDto, TDto> {
}
