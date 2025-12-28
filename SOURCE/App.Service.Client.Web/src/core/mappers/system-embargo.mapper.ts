import { SystemEmbargoDto } from '../models/dtos/system-embargo.dto';
import { SystemEmbargoViewModel } from '../models/view-models/system-embargo.view-model';

export function mapSystemEmbargoDtoToViewModel(dto: SystemEmbargoDto): SystemEmbargoViewModel {
  // Extract year from title (e.g., "UN 1991" -> "1991")
  const yearMatch = dto.title.match(/\d{4}/);
  const year = yearMatch ? yearMatch[0] : undefined;
  
  return {
    id: dto.id,
    enabled: dto.enabled,
    title: dto.title,
    description: dto.description,
    displayLabel: dto.title,
    year: year,
    reference: dto.title
  };
}

export function mapSystemEmbargoDtosToViewModels(dtos: SystemEmbargoDto[]): SystemEmbargoViewModel[] {
  return dtos.map(dto => mapSystemEmbargoDtoToViewModel(dto));
}

export function mapSystemEmbargoViewModelToDto(viewModel: SystemEmbargoViewModel): SystemEmbargoDto {
  return {
    id: viewModel.id,
    enabled: viewModel.enabled,
    title: viewModel.title,
    description: viewModel.description
  };
}
