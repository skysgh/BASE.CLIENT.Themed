import { ArchitectureQualityCategoryDto } from '../models/dtos/architecture-quality-category.dto';
import { ArchitectureQualityCategoryViewModel } from '../models/view-models/architecture-quality-category.view-model';

export function mapArchitectureQualityCategoryDtoToViewModel(dto: ArchitectureQualityCategoryDto): ArchitectureQualityCategoryViewModel {
  return {
    id: dto.id,
    typeId: dto.typeFk,
    title: dto.title,
    description: dto.description,
    displayLabel: dto.title
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
