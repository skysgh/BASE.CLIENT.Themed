import { ServiceWorkprocessDto } from '../models/dtos/service-workprocess.dto';
import { ServiceWorkprocessViewModel } from '../models/view-models/service-workprocess.view-model';

export function mapServiceWorkprocessDtoToViewModel(
  dto: ServiceWorkprocessDto,
  stepNumber?: number
): ServiceWorkprocessViewModel {
  return {
    id: dto.id,
    serviceId: dto.serviceId,
    enabled: dto.enabled,
    imageId: dto.imageId,
    title: dto.title,
    description: dto.description,
    displayLabel: dto.title,
    stepNumber: stepNumber
  };
}

export function mapServiceWorkprocessDtosToViewModels(
  dtos: ServiceWorkprocessDto[]
): ServiceWorkprocessViewModel[] {
  return dtos.map((dto, index) => mapServiceWorkprocessDtoToViewModel(dto, index + 1));
}

export function mapServiceWorkprocessViewModelToDto(
  viewModel: ServiceWorkprocessViewModel
): ServiceWorkprocessDto {
  return {
    id: viewModel.id,
    serviceId: viewModel.serviceId,
    enabled: viewModel.enabled,
    imageId: viewModel.imageId,
    title: viewModel.title,
    description: viewModel.description
  };
}
