import { ArchitecturePrincipleTypeDto } from '../models/dtos/architecture-principle-type.dto';
import { ArchitecturePrincipleTypeViewModel } from '../models/view-models/architecture-principle-type.view-model';

export function mapArchitecturePrincipleTypeDtoToViewModel(dto: ArchitecturePrincipleTypeDto): ArchitecturePrincipleTypeViewModel {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    displayLabel: toTitleCase(dto.title)
  };
}

export function mapArchitecturePrincipleTypeDtosToViewModels(dtos: ArchitecturePrincipleTypeDto[]): ArchitecturePrincipleTypeViewModel[] {
  return dtos.map(dto => mapArchitecturePrincipleTypeDtoToViewModel(dto));
}

export function mapArchitecturePrincipleTypeViewModelToDto(viewModel: ArchitecturePrincipleTypeViewModel): ArchitecturePrincipleTypeDto {
  return {
    id: viewModel.id,
    title: viewModel.title,
    description: viewModel.description
  };
}

function toTitleCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
