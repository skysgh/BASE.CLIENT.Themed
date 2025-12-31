import { ServiceSettingsUserSettingDto } from '../models/dtos/service-settings-user-setting.dto';
import { ServiceSettingsUserSettingViewModel } from '../models/view-models/service-settings-user-setting.view-model';

export function mapServiceSettingsUserSettingDtoToViewModel(
  dto: ServiceSettingsUserSettingDto
): ServiceSettingsUserSettingViewModel {
  return {
    id: dto.id,
    userId: dto.userId,
    key: dto.key,
    value: parseValue(dto.value, dto.valueType),
    valueType: dto.valueType,
    category: dto.category,
    enabled: dto.enabled,
    displayValue: dto.value,
    createdAt: new Date(dto.createdUtc),
    modifiedAt: new Date(dto.modifiedUtc)
  };
}

export function mapServiceSettingsUserSettingDtosToViewModels(
  dtos: ServiceSettingsUserSettingDto[]
): ServiceSettingsUserSettingViewModel[] {
  return dtos.map(mapServiceSettingsUserSettingDtoToViewModel);
}

function parseValue(value: string, valueType: string): any {
  switch (valueType) {
    case 'number':
      return parseFloat(value);
    case 'boolean':
      return value === 'true';
    case 'json':
      try { return JSON.parse(value); } catch { return value; }
    default:
      return value;
  }
}
