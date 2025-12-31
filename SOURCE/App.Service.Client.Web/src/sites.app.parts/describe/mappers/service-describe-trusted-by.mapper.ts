import { ServiceDescribeTrustedByDto } from '../models/dtos/service-describe-trusted-by.dto';
import { ServiceDescribeTrustedByViewModel } from '../models/view-models/service-describe-trusted-by.view-model';

export function mapServiceDescribeTrustedByDtoToViewModel(dto: ServiceDescribeTrustedByDto): ServiceDescribeTrustedByViewModel {
  return {
    id: dto.id,
    title: dto.title,
    imageName: dto.imageName,
    enabled: dto.enabled
  };
}

export function mapServiceDescribeTrustedByDtosToViewModels(dtos: ServiceDescribeTrustedByDto[]): ServiceDescribeTrustedByViewModel[] {
  return dtos.map(mapServiceDescribeTrustedByDtoToViewModel);
}
