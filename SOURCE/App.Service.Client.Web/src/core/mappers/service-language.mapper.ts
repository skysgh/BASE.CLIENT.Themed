import { ServiceLanguageDto } from '../models/dtos/service-language.dto';
import { ServiceLanguageViewModel } from '../models/view-models/service-language.view-model';

export function mapServiceLanguageDtoToViewModel(dto: ServiceLanguageDto): ServiceLanguageViewModel {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    languageCode: dto.languageCode,
    flagImageId: dto.flagImageId,
    enabled: dto.enabled
  };
}

export function mapServiceLanguageDtosToViewModels(dtos: ServiceLanguageDto[]): ServiceLanguageViewModel[] {
  return dtos.map(mapServiceLanguageDtoToViewModel);
}
