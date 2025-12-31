import { ServiceOperateEmbargoDto } from '../models/dtos/service-operate-embargo.dto';
import { ServiceOperateEmbargoViewModel } from '../models/view-models/service-operate-embargo.view-model';

export function mapServiceOperateEmbargoDtoToViewModel(dto: ServiceOperateEmbargoDto): ServiceOperateEmbargoViewModel {
  return {
    id: dto.id,
    countryCode: dto.countryCode,
    countryName: dto.countryName,
    reason: dto.reason,
    enabled: dto.enabled
  };
}

export function mapServiceOperateEmbargoDtosToViewModels(dtos: ServiceOperateEmbargoDto[]): ServiceOperateEmbargoViewModel[] {
  return dtos.map(mapServiceOperateEmbargoDtoToViewModel);
}
