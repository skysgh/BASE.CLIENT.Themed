import { SystemEmbargoDto } from '../models/dtos/system-embargo.dto';
import { SystemEmbargoViewModel } from '../models/view-models/system-embargo.view-model';

export function mapSystemEmbargoDtoToViewModel(dto: SystemEmbargoDto): SystemEmbargoViewModel {
  return {
    id: dto.id,
    countryCode: dto.countryCode,
    countryName: dto.countryName,
    reason: dto.reason,
    enabled: dto.enabled
  };
}

export function mapSystemEmbargoDtosToViewModels(dtos: SystemEmbargoDto[]): SystemEmbargoViewModel[] {
  return dtos.map(mapSystemEmbargoDtoToViewModel);
}
