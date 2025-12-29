import { SystemLanguageDto } from '../models/dtos/system-language.dto';
import { SystemLanguageViewModel } from '../models/view-models/system-language.view-model';

export function mapSystemLanguageDtoToViewModel(dto: SystemLanguageDto): SystemLanguageViewModel {
  return {
    id: dto.id,
    enabled: dto.enabled,
    name: dto.title,
    nativeName: dto.description,
    languageCode: dto.languageCode,
    code: dto.languageCode,  // alias for backward compatibility
    flagImageId: dto.flagImageId,
    displayLabel: `${dto.title} (${dto.description})`
  };
}

export function mapSystemLanguageDtosToViewModels(dtos: SystemLanguageDto[]): SystemLanguageViewModel[] {
  return dtos.map(mapSystemLanguageDtoToViewModel);
}
