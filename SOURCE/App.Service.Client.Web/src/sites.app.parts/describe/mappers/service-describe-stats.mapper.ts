import { ServiceDescribeStatsDto } from '../models/dtos/service-describe-stats.dto';
import { ServiceDescribeStatsViewModel } from '../models/view-models/service-describe-stats.view-model';

export function mapServiceDescribeStatsDtoToViewModel(dto: ServiceDescribeStatsDto): ServiceDescribeStatsViewModel {
  return {
    id: dto.id,
    title: dto.title,
    value: dto.value,
    description: dto.description,
    enabled: dto.enabled
  };
}

export function mapServiceDescribeStatsDtosToViewModels(dtos: ServiceDescribeStatsDto[]): ServiceDescribeStatsViewModel[] {
  return dtos.map(mapServiceDescribeStatsDtoToViewModel);
}
