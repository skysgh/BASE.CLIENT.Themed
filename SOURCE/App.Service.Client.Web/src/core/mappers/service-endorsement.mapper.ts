import { ServiceEndorsementDto } from '../models/dtos/service-endorsement.dto';
import { ServiceEndorsementViewModel } from '../models/view-models/service-endorsement.view-model';

export function mapServiceEndorsementDtoToViewModel(dto: ServiceEndorsementDto): ServiceEndorsementViewModel {
  return {
    id: dto.id,
    quote: dto.description,
    author: dto.by,
    role: dto.role,
    enabled: dto.enabled
  };
}

export function mapServiceEndorsementViewModelToDto(vm: ServiceEndorsementViewModel): ServiceEndorsementDto {
  return {
    id: vm.id,
    title: vm.quote.substring(0, 50),
    description: vm.quote,
    by: vm.author,
    role: vm.role,
    enabled: vm.enabled
  };
}

export function mapServiceEndorsementDtosToViewModels(dtos: ServiceEndorsementDto[]): ServiceEndorsementViewModel[] {
  return dtos.map(mapServiceEndorsementDtoToViewModel);
}
