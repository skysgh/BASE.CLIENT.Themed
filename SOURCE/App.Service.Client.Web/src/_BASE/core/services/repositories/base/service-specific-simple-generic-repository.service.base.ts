import { IHasServiceId } from "../../../models/contracts/IHasServiceId";
import { SimpleGenericRepositoryServiceBase } from "./simple-generic-repository-service.base";
import { MappedGenericRepositoryServiceBase } from "./mapped-generic-repository.service.base";


/** Service to retrieve entities specific to a Service.Id */
export abstract class ServiceSpecificSimpleGenericRepositoryServiceBase<TDto extends IHasServiceId>
  extends MappedGenericRepositoryServiceBase<TDto, TDto> {
  // Make system/env variables avaiable to class & view template:
  // already defined in superclass: public system = importedSystemConst;


  protected override MapObjectTo(dto: TDto): TDto{
    return dto;
  }
  protected override MapObjectFrom(dto: TDto): TDto {
    return dto;
  }

      
}

