import { ServiceProductTypeDto } from '../models/dtos/service-product-type.dto';
import { ServiceProductTypeViewModel } from '../models/view-models/service-product-type.view-model';

export function mapServiceProductTypeDtoToViewModel(dto: ServiceProductTypeDto): ServiceProductTypeViewModel {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    displayLabel: dto.title
  };
}

export function mapServiceProductTypeDtosToViewModels(dtos: ServiceProductTypeDto[]): ServiceProductTypeViewModel[] {
  return dtos.map(dto => mapServiceProductTypeDtoToViewModel(dto));
}

export function mapServiceProductTypeViewModelToDto(viewModel: ServiceProductTypeViewModel): ServiceProductTypeDto {
  return {
    id: viewModel.id,
    title: viewModel.title,
    description: viewModel.description
  };
}
