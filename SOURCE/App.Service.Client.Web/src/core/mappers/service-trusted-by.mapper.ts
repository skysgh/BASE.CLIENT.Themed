import { ServiceTrustedByDto } from '../models/dtos/service-trusted-by.dto';
import { ServiceTrustedByViewModel } from '../models/view-models/service-trusted-by.view-model';

export function mapServiceTrustedByDtoToViewModel(dto: ServiceTrustedByDto): ServiceTrustedByViewModel {
  return {
    id: dto.id,
    title: dto.title,
    imageName: dto.imageName,
    enabled: dto.enabled
  };
}

export function mapServiceTrustedByDtosToViewModels(dtos: ServiceTrustedByDto[]): ServiceTrustedByViewModel[] {
  return dtos.map(mapServiceTrustedByDtoToViewModel);
}
