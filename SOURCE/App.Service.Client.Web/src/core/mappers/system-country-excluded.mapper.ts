import { SystemCountryExcludedDto } from '../models/dtos/system-country-excluded.dto';
import { SystemCountryExcludedViewModel } from '../models/view-models/system-country-excluded.view-model';

export function mapSystemCountryExcludedDtoToViewModel(
  dto: SystemCountryExcludedDto,
  embargoReference?: string
): SystemCountryExcludedViewModel {
  return {
    id: dto.id,
    embargoId: dto.embargoFk,
    countryName: dto.title,
    description: dto.description,
    ipRange: dto.range,
    displayLabel: dto.title,
    embargoReference: embargoReference
  };
}

export function mapSystemCountryExcludedDtosToViewModels(
  dtos: SystemCountryExcludedDto[],
  getEmbargoReference: (embargoId: string) => string = () => 'Unknown'
): SystemCountryExcludedViewModel[] {
  return dtos.map(dto => mapSystemCountryExcludedDtoToViewModel(dto, getEmbargoReference(dto.embargoFk)));
}

export function mapSystemCountryExcludedViewModelToDto(
  viewModel: SystemCountryExcludedViewModel
): SystemCountryExcludedDto {
  return {
    id: viewModel.id,
    embargoFk: viewModel.embargoId,
    title: viewModel.countryName,
    description: viewModel.description,
    range: viewModel.ipRange
  };
}
