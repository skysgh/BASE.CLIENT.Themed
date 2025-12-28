import { ArchitectureQualityCategoryDto } from '../models/dtos/architecture-quality-category.dto';
import { ArchitectureQualityCategoryViewModel } from '../models/view-models/architecture-quality-category.view-model';

export function mapArchitectureQualityCategoryDtoToViewModel(dto: ArchitectureQualityCategoryDto): ArchitectureQualityCategoryViewModel {
  const parts = parseTitle(dto.title);
  
  return {
    id: dto.id,
    typeId: dto.typeFk,
    title: dto.title,
    description: dto.description,
    displayLabel: dto.title,
    shortName: parts.shortName,
    standardRef: parts.standardRef
  };
}

export function mapArchitectureQualityCategoryDtosToViewModels(dtos: ArchitectureQualityCategoryDto[]): ArchitectureQualityCategoryViewModel[] {
  return dtos.map(dto => mapArchitectureQualityCategoryDtoToViewModel(dto));
}

export function mapArchitectureQualityCategoryViewModelToDto(viewModel: ArchitectureQualityCategoryViewModel): ArchitectureQualityCategoryDto {
  return {
    id: viewModel.id,
    typeFk: viewModel.typeId,
    title: viewModel.title,
    description: viewModel.description
  };
}

function parseTitle(title: string): { shortName: string; standardRef: string } {
  const parts = title.split('/');
  if (parts.length === 2) {
    return {
      standardRef: parts[0].trim(),
      shortName: parts[1].trim()
    };
  }
  return {
    standardRef: '',
    shortName: title
  };
}
