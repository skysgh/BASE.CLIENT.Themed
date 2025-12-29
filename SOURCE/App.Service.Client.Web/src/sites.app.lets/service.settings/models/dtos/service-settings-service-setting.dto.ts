/**
 * Service Setting DTO
 * Platform-wide settings (super admin only)
 */
export interface ServiceSettingsServiceSettingDto {
  id: string;
  key: string;
  value: string;
  valueType: 'string' | 'number' | 'boolean' | 'json';
  category: string;
  description?: string;
  isSecret: boolean;
  enabled: boolean;
  createdUtc: string;
  modifiedUtc: string;
}
