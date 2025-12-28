import { BrochureStatsDto } from '../models/dtos/brochure-stats.dto';
import { BrochureStatsViewModel } from '../models/view-models/brochure-stats.view-model';

export function mapBrochureStatsDtoToViewModel(dto: BrochureStatsDto): BrochureStatsViewModel {
  return {
    id: dto.id,
    title: dto.title,
    value: dto.value,
    description: dto.description,
    enabled: dto.enabled
  };
}

export function mapBrochureStatsDtosToViewModels(dtos: BrochureStatsDto[]): BrochureStatsViewModel[] {
  return dtos.map(mapBrochureStatsDtoToViewModel);
}
