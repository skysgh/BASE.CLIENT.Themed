import { ServiceCapabilityDto } from '../models/dtos/service-capability.dto';
import { ServiceCapabilityViewModel } from '../models/view-models/service-capability.view-model';

export function mapServiceCapabilityDtoToViewModel(dto: ServiceCapabilityDto): ServiceCapabilityViewModel {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    imageId: dto.imageId,
    enabled: dto.enabled
  };
}

export function mapServiceCapabilityDtosToViewModels(dtos: ServiceCapabilityDto[]): ServiceCapabilityViewModel[] {
  return dtos.map(mapServiceCapabilityDtoToViewModel);
}
