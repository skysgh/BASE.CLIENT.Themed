import { ServiceOperateCountryExcludedDto } from '../models/dtos/service-operate-country-excluded.dto';
import { ServiceOperateCountryExcludedViewModel } from '../models/view-models/service-operate-country-excluded.view-model';

export function mapServiceOperateCountryExcludedDtoToViewModel(dto: ServiceOperateCountryExcludedDto): ServiceOperateCountryExcludedViewModel {
  return {
    id: dto.id,
    countryCode: dto.countryCode,
    countryName: dto.countryName,
    reason: dto.reason
  };
}

export function mapServiceOperateCountryExcludedDtosToViewModels(dtos: ServiceOperateCountryExcludedDto[]): ServiceOperateCountryExcludedViewModel[] {
  return dtos.map(mapServiceOperateCountryExcludedDtoToViewModel);
}
