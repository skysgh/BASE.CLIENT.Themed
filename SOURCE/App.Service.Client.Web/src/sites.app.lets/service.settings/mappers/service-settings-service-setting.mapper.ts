import { ServiceSettingsServiceSettingDto } from '../models/dtos/service-settings-service-setting.dto';
import { ServiceSettingsServiceSettingViewModel } from '../models/view-models/service-settings-service-setting.view-model';

export function mapServiceSettingsServiceSettingDtoToViewModel(
  dto: ServiceSettingsServiceSettingDto
): ServiceSettingsServiceSettingViewModel {
  return {
    id: dto.id,
    key: dto.key,
    value: parseValue(dto.value, dto.valueType),
    valueType: dto.valueType,
    category: dto.category,
    description: dto.description,
    isSecret: dto.isSecret,
    enabled: dto.enabled,
    displayValue: dto.isSecret ? '********' : dto.value,
    createdAt: new Date(dto.createdUtc),
    modifiedAt: new Date(dto.modifiedUtc)
  };
}

export function mapServiceSettingsServiceSettingDtosToViewModels(
  dtos: ServiceSettingsServiceSettingDto[]
): ServiceSettingsServiceSettingViewModel[] {
  return dtos.map(mapServiceSettingsServiceSettingDtoToViewModel);
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
