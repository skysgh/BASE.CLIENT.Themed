/**
 * User Setting DTO
 * Per-user preferences (all users)
 */
export interface ServiceSettingsUserSettingDto {
  id: string;
  userId: string;
  key: string;
  value: string;
  valueType: 'string' | 'number' | 'boolean' | 'json';
  category: string;
  enabled: boolean;
  createdUtc: string;
  modifiedUtc: string;
}
