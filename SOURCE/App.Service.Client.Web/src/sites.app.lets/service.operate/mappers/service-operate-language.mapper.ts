import { ServiceOperateLanguageDto } from '../models/dtos/service-operate-language.dto';
import { ServiceOperateLanguageViewModel } from '../models/view-models/service-operate-language.view-model';

export function mapServiceOperateLanguageDtoToViewModel(dto: ServiceOperateLanguageDto): ServiceOperateLanguageViewModel {
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

export function mapServiceOperateLanguageDtosToViewModels(dtos: ServiceOperateLanguageDto[]): ServiceOperateLanguageViewModel[] {
  return dtos.map(mapServiceOperateLanguageDtoToViewModel);
}
