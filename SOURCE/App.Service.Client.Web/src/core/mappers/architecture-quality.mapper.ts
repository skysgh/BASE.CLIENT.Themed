import { ArchitectureQualityDto } from '../models/dtos/architecture-quality.dto';
import { ArchitectureQualityViewModel } from '../models/view-models/architecture-quality.view-model';

export function mapArchitectureQualityDtoToViewModel(dto: ArchitectureQualityDto): ArchitectureQualityViewModel {
  return {
    id: dto.id,
    categoryId: dto.categoryFk,
    title: dto.title,
    description: dto.description,
    displayLabel: dto.title,
    requirementType: extractRequirementType(dto.title)
  };
}

export function mapArchitectureQualityDtosToViewModels(dtos: ArchitectureQualityDto[]): ArchitectureQualityViewModel[] {
  return dtos.map(dto => mapArchitectureQualityDtoToViewModel(dto));
}

export function mapArchitectureQualityViewModelToDto(viewModel: ArchitectureQualityViewModel): ArchitectureQualityDto {
  return {
    id: viewModel.id,
    categoryFk: viewModel.categoryId,
    title: viewModel.title,
    description: viewModel.description
  };
}

function extractRequirementType(title: string): string {
  const match = title.match(/\b(MUST|SHOULD|MAY|SHALL|CAN)\b/i);
  return match ? match[0].toUpperCase() : 'UNSPECIFIED';
}
