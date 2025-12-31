import { ServiceSettingsAccountSettingDto } from '../models/dtos/service-settings-account-setting.dto';
import { ServiceSettingsAccountSettingViewModel } from '../models/view-models/service-settings-account-setting.view-model';

export function mapServiceSettingsAccountSettingDtoToViewModel(
  dto: ServiceSettingsAccountSettingDto
): ServiceSettingsAccountSettingViewModel {
  return {
    id: dto.id,
    accountId: dto.accountId,
    key: dto.key,
    value: parseValue(dto.value, dto.valueType),
    valueType: dto.valueType,
    category: dto.category,
    description: dto.description,
    enabled: dto.enabled,
    displayValue: dto.value,
    createdAt: new Date(dto.createdUtc),
    modifiedAt: new Date(dto.modifiedUtc)
  };
}

export function mapServiceSettingsAccountSettingDtosToViewModels(
  dtos: ServiceSettingsAccountSettingDto[]
): ServiceSettingsAccountSettingViewModel[] {
  return dtos.map(mapServiceSettingsAccountSettingDtoToViewModel);
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
