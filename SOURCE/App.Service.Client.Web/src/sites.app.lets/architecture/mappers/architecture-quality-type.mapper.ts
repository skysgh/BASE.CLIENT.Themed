import { ArchitectureQualityTypeDto } from '../models/dtos/architecture-quality-type.dto';
import { ArchitectureQualityTypeViewModel } from '../models/view-models/architecture-quality-type.view-model';

export function mapArchitectureQualityTypeDtoToViewModel(dto: ArchitectureQualityTypeDto): ArchitectureQualityTypeViewModel {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    displayLabel: dto.title
  };
}

export function mapArchitectureQualityTypeDtosToViewModels(dtos: ArchitectureQualityTypeDto[]): ArchitectureQualityTypeViewModel[] {
  return dtos.map(dto => mapArchitectureQualityTypeDtoToViewModel(dto));
}

export function mapArchitectureQualityTypeViewModelToDto(viewModel: ArchitectureQualityTypeViewModel): ArchitectureQualityTypeDto {
  return {
    id: viewModel.id,
    title: viewModel.title,
    description: viewModel.description
  };
}
