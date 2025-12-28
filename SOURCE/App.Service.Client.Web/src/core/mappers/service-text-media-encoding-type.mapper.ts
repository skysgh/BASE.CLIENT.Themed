import { ServiceTextMediaEncodingTypeDto } from '../models/dtos/service-text-media-encoding-type.dto';
import { ServiceTextMediaEncodingTypeViewModel } from '../models/view-models/service-text-media-encoding-type.view-model';

export function mapServiceTextMediaEncodingTypeDtoToViewModel(
  dto: ServiceTextMediaEncodingTypeDto
): ServiceTextMediaEncodingTypeViewModel {
  const titleLower = dto.title.toLowerCase();
  
  return {
    id: dto.id,
    serviceId: dto.serviceId,
    title: dto.title,
    description: dto.description,
    displayLabel: dto.title,
    isHtml: titleLower === 'html',
    isMarkdown: titleLower === 'markdown'
  };
}

export function mapServiceTextMediaEncodingTypeDtosToViewModels(
  dtos: ServiceTextMediaEncodingTypeDto[]
): ServiceTextMediaEncodingTypeViewModel[] {
  return dtos.map(dto => mapServiceTextMediaEncodingTypeDtoToViewModel(dto));
}

export function mapServiceTextMediaEncodingTypeViewModelToDto(
  viewModel: ServiceTextMediaEncodingTypeViewModel
): ServiceTextMediaEncodingTypeDto {
  return {
    id: viewModel.id,
    serviceId: viewModel.serviceId,
    title: viewModel.title,
    description: viewModel.description
  };
}
