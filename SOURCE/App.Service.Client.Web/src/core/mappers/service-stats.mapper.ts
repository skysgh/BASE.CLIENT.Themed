import { ServiceStatsDto } from '../models/dtos/service-stats.dto';
import { ServiceStatsViewModel } from '../models/view-models/service-stats.view-model';

export function mapServiceStatsDtoToViewModel(dto: ServiceStatsDto): ServiceStatsViewModel {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    imageId: dto.imageId,
    value: dto.value,
    decimalPlaces: dto.decimalPlaces,
    prefix: dto.prefix,
    suffix: dto.suffix,
    changeDirection: dto.changeDirection,
    enabled: dto.enabled
  };
}

export function mapServiceStatsDtosToViewModels(dtos: ServiceStatsDto[]): ServiceStatsViewModel[] {
  return dtos.map(mapServiceStatsDtoToViewModel);
}
