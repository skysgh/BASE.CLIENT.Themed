import { BrochureCapabilityDto } from '../models/dtos/brochure-capability.dto';
import { BrochureCapabilityViewModel } from '../models/view-models/brochure-capability.view-model';

export function mapBrochureCapabilityDtoToViewModel(dto: BrochureCapabilityDto): BrochureCapabilityViewModel {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    imageId: dto.imageId,
    enabled: dto.enabled
  };
}

export function mapBrochureCapabilityDtosToViewModels(dtos: BrochureCapabilityDto[]): BrochureCapabilityViewModel[] {
  return dtos.map(mapBrochureCapabilityDtoToViewModel);
}
