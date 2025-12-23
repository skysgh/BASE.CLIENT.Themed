import { MappedGenericRepositoryServiceBase } from "./mapped-generic-repository.service.base";

/**
 * An abstract base class for
 * a repository service that is getting objects
 * and returning them without mapping them to related VTO objects.
 * As such it only requires one generic type (the DTO) skipping mentioning a VTO.
 * 
 * The `MapObjectTo` and `MapObjectFrom` are implemented as
 * simple methods that return the input.
 *
 * Implements:
 * MappedGenericRepositoryServiceBase<TDto,TDto>
 */
export abstract class SimpleGenericRepositoryServiceBase<TDto> extends
  MappedGenericRepositoryServiceBase<TDto, TDto> {


/* Map incoming TDto to a TVto more appropriate for the UI.
   * TODO: need to use the proper service to do this kind of work.
   * @param dto
  * @returns
  *
  * Should use
  * ```this.objectMappingService.map(dto..., ...);```
  * but when it is the same type, often all that's done is
  * ```return dto;```
  * or if a change of type is required to be involved:
  * ```return ((dto as unknown) as Foo);```
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
 * 
  * Should use
  * ```this.objectMappingService.map(dto..., ...);```
  * but when it is the same type, often all that's done is
  * ```return dto;```
  * or if a change of type is required to be involved:
  * ```return ((dto as unknown) as Foo);```
 */
  protected override MapObjectFrom(dto: TDto): TDto {
  //this.objectMappingService.map(dto..., ...);
    return dto;
}

};

