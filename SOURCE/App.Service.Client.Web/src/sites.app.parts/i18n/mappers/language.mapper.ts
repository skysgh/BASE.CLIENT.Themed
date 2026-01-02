/**
 * Language Mapper
 * 
 * Maps LanguageDto to LanguageViewModel.
 */
import { LanguageDto } from '../models/language.dto';
import { LanguageViewModel } from '../models/language.view-model';

export function mapLanguageDtoToViewModel(dto: LanguageDto): LanguageViewModel {
  return {
    id: dto.id,
    enabled: dto.enabled,
    name: dto.title,
    nativeName: dto.description,
    languageCode: dto.languageCode,
    flagImageId: dto.flagImageId,
    displayLabel: `${dto.title} (${dto.languageCode})`,
    flagUrl: dto.flagImageId ? `/api/files/${dto.flagImageId}` : `/assets/flags/${dto.languageCode}.svg`,
  };
}

export function mapLanguageDtosToViewModels(dtos: LanguageDto[]): LanguageViewModel[] {
  return dtos.map(mapLanguageDtoToViewModel);
}
