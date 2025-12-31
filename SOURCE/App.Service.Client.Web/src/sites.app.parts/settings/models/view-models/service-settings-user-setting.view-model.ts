/**
 * User Setting View Model
 * Per-user preferences (all users)
 */
export interface ServiceSettingsUserSettingViewModel {
  id: string;
  userId: string;
  key: string;
  value: any;
  valueType: 'string' | 'number' | 'boolean' | 'json';
  category: string;
  enabled: boolean;
  displayValue: string;
  createdAt: Date;
  modifiedAt: Date;
}
