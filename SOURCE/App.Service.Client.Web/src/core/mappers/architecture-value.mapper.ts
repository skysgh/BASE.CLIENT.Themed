import { ArchitectureValueDto } from '../models/dtos/architecture-value.dto';
import { ArchitectureValueViewModel } from '../models/view-models/architecture-value.view-model';

export function mapArchitectureValueDtoToViewModel(dto: ArchitectureValueDto): ArchitectureValueViewModel {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    displayLabel: toTitleCase(dto.title)
  };
}

export function mapArchitectureValueDtosToViewModels(dtos: ArchitectureValueDto[]): ArchitectureValueViewModel[] {
  return dtos.map(dto => mapArchitectureValueDtoToViewModel(dto));
}

export function mapArchitectureValueViewModelToDto(viewModel: ArchitectureValueViewModel): ArchitectureValueDto {
  return {
    id: viewModel.id,
    title: viewModel.title,
    description: viewModel.description
  };
}

function toTitleCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
