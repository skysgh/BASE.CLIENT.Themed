import { SystemCountryExcludedDto } from '../models/dtos/system-country-excluded.dto';
import { SystemCountryExcludedViewModel } from '../models/view-models/system-country-excluded.view-model';

export function mapSystemCountryExcludedDtoToViewModel(dto: SystemCountryExcludedDto): SystemCountryExcludedViewModel {
  return {
    id: dto.id,
    countryCode: dto.countryCode,
    countryName: dto.countryName,
    reason: dto.reason
  };
}

export function mapSystemCountryExcludedDtosToViewModels(dtos: SystemCountryExcludedDto[]): SystemCountryExcludedViewModel[] {
  return dtos.map(mapSystemCountryExcludedDtoToViewModel);
}
