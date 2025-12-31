/**
 * Service Setting View Model
 * Platform-wide settings (super admin only)
 */
export interface ServiceSettingsServiceSettingViewModel {
  id: string;
  key: string;
  value: any;
  valueType: 'string' | 'number' | 'boolean' | 'json';
  category: string;
  description?: string;
  isSecret: boolean;
  enabled: boolean;
  displayValue: string;
  createdAt: Date;
  modifiedAt: Date;
}
