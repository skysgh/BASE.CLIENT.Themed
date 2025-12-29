import { ServiceDescribeCapabilityDto } from '../models/dtos/service-describe-capability.dto';
import { ServiceDescribeCapabilityViewModel } from '../models/view-models/service-describe-capability.view-model';

export function mapServiceDescribeCapabilityDtoToViewModel(dto: ServiceDescribeCapabilityDto): ServiceDescribeCapabilityViewModel {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    imageId: dto.imageId,
    enabled: dto.enabled
  };
}

export function mapServiceDescribeCapabilityDtosToViewModels(dtos: ServiceDescribeCapabilityDto[]): ServiceDescribeCapabilityViewModel[] {
  return dtos.map(mapServiceDescribeCapabilityDtoToViewModel);
}
