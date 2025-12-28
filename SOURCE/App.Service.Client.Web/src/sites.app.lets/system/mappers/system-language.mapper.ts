import { SystemLanguageDto } from '../models/dtos/system-language.dto';
import { SystemLanguageViewModel } from '../models/view-models/system-language.view-model';

export function mapSystemLanguageDtoToViewModel(dto: SystemLanguageDto): SystemLanguageViewModel {
  return {
    id: dto.id,
    code: dto.code,
    name: dto.name,
    nativeName: dto.nativeName,
    enabled: dto.enabled,
    displayLabel: `${dto.name} (${dto.nativeName})`
  };
}

export function mapSystemLanguageDtosToViewModels(dtos: SystemLanguageDto[]): SystemLanguageViewModel[] {
  return dtos.map(mapSystemLanguageDtoToViewModel);
}
