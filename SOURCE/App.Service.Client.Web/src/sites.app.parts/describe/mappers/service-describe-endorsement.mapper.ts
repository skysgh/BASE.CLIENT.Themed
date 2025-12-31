import { ServiceDescribeEndorsementDto } from '../models/dtos/service-describe-endorsement.dto';
import { ServiceDescribeEndorsementViewModel } from '../models/view-models/service-describe-endorsement.view-model';

export function mapServiceDescribeEndorsementDtoToViewModel(dto: ServiceDescribeEndorsementDto): ServiceDescribeEndorsementViewModel {
  return {
    id: dto.id,
    quote: dto.description,
    author: dto.by,
    role: dto.role,
    enabled: dto.enabled
  };
}

export function mapServiceDescribeEndorsementViewModelToDto(vm: ServiceDescribeEndorsementViewModel): ServiceDescribeEndorsementDto {
  return {
    id: vm.id,
    title: vm.quote.substring(0, 50),
    description: vm.quote,
    by: vm.author,
    role: vm.role,
    enabled: vm.enabled
  };
}

export function mapServiceDescribeEndorsementDtosToViewModels(dtos: ServiceDescribeEndorsementDto[]): ServiceDescribeEndorsementViewModel[] {
  return dtos.map(mapServiceDescribeEndorsementDtoToViewModel);
}
