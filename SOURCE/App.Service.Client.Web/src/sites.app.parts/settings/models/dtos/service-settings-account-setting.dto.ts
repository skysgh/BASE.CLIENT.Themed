/**
 * Account Setting DTO
 * Per-tenant settings (account admin)
 */
export interface ServiceSettingsAccountSettingDto {
  id: string;
  accountId: string;
  key: string;
  value: string;
  valueType: 'string' | 'number' | 'boolean' | 'json';
  category: string;
  description?: string;
  enabled: boolean;
  createdUtc: string;
  modifiedUtc: string;
}
