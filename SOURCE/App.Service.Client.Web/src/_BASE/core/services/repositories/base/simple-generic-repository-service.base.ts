import { MappedGenericRepositoryServiceBase } from "./mapped-generic-repository.service.base";

export abstract class SimpleGenericRepositoryServiceBase<TDto> extends
  MappedGenericRepositoryServiceBase<TDto, TDto> {



/* Map incoming TDto to a TVto more appropriate for the UI.
   * TODO: need to use the proper service to do this kind of work.
   * @param dto
  * @returns
  */
  protected override MapObjectTo(dto: TDto): TDto {
  //this.objectMappingService.map(dto..., ...);
    return dto;
}
  /**
 * Map TVto back to a TDto more appropriate for saving/updating in a db.
 * TODO: need to use the proper service to do this kind of work.
 * @param dto
 * @returns
 */
  protected override MapObjectFrom(dto: TDto): TDto {
  //this.objectMappingService.map(dto..., ...);
    return dto;
}

};

