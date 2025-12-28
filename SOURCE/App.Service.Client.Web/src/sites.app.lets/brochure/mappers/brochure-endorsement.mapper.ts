import { BrochureEndorsementDto } from '../models/dtos/brochure-endorsement.dto';
import { BrochureEndorsementViewModel } from '../models/view-models/brochure-endorsement.view-model';

export function mapBrochureEndorsementDtoToViewModel(dto: BrochureEndorsementDto): BrochureEndorsementViewModel {
  return {
    id: dto.id,
    quote: dto.description,
    author: dto.by,
    role: dto.role,
    enabled: dto.enabled
  };
}

export function mapBrochureEndorsementViewModelToDto(vm: BrochureEndorsementViewModel): BrochureEndorsementDto {
  return {
    id: vm.id,
    title: vm.quote.substring(0, 50),
    description: vm.quote,
    by: vm.author,
    role: vm.role,
    enabled: vm.enabled
  };
}

export function mapBrochureEndorsementDtosToViewModels(dtos: BrochureEndorsementDto[]): BrochureEndorsementViewModel[] {
  return dtos.map(mapBrochureEndorsementDtoToViewModel);
}
