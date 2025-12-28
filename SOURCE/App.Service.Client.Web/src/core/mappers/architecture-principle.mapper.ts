import { ArchitecturePrincipleDto } from '../models/dtos/architecture-principle.dto';
import { ArchitecturePrincipleViewModel } from '../models/view-models/architecture-principle.view-model';

export function mapArchitecturePrincipleDtoToViewModel(
  dto: ArchitecturePrincipleDto,
  categoryName: string = 'unknown'
): ArchitecturePrincipleViewModel {
  return {
    id: dto.id,
    typeId: dto.typeFk,
    title: dto.title,
    description: dto.description,
    displayLabel: dto.title,
    category: categoryName
  };
}

export function mapArchitecturePrincipleDtosToViewModels(
  dtos: ArchitecturePrincipleDto[],
  getCategoryName: (typeId: string) => string = () => 'unknown'
): ArchitecturePrincipleViewModel[] {
  return dtos.map(dto => mapArchitecturePrincipleDtoToViewModel(dto, getCategoryName(dto.typeFk)));
}

export function mapArchitecturePrincipleViewModelToDto(viewModel: ArchitecturePrincipleViewModel): ArchitecturePrincipleDto {
  return {
    id: viewModel.id,
    typeFk: viewModel.typeId,
    title: viewModel.title,
    description: viewModel.description
  };
}
