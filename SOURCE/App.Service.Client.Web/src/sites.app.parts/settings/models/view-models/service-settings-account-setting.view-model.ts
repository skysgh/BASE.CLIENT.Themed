/**
 * Account Setting View Model
 * Per-tenant settings (account admin)
 */
export interface ServiceSettingsAccountSettingViewModel {
  id: string;
  accountId: string;
  key: string;
  value: any;
  valueType: 'string' | 'number' | 'boolean' | 'json';
  category: string;
  description?: string;
  enabled: boolean;
  displayValue: string;
  createdAt: Date;
  modifiedAt: Date;
}
