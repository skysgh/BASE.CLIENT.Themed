import { BrochureTrustedByDto } from '../models/dtos/brochure-trusted-by.dto';
import { BrochureTrustedByViewModel } from '../models/view-models/brochure-trusted-by.view-model';

export function mapBrochureTrustedByDtoToViewModel(dto: BrochureTrustedByDto): BrochureTrustedByViewModel {
  return {
    id: dto.id,
    title: dto.title,
    imageName: dto.imageName,
    enabled: dto.enabled
  };
}

export function mapBrochureTrustedByDtosToViewModels(dtos: BrochureTrustedByDto[]): BrochureTrustedByViewModel[] {
  return dtos.map(mapBrochureTrustedByDtoToViewModel);
}
