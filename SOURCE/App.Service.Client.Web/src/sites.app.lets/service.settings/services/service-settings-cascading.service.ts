import { Injectable, computed } from '@angular/core';
import { ServiceSettingsServiceSettingService } from './service-settings-service-setting.service';
import { ServiceSettingsAccountSettingService } from './service-settings-account-setting.service';
import { ServiceSettingsUserSettingService } from './service-settings-user-setting.service';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

/**
 * Cascading Settings Service
 * 
 * Provides unified access to settings with cascading priority:
 * User → Account → Service → Default
 * 
 * Higher priority settings override lower priority ones.
 */
@Injectable({ providedIn: 'root' })
export class ServiceSettingsCascadingService {
  
  // Combined loading state
  loading = computed(() => 
    this.serviceSettings.loading() || 
    this.accountSettings.loading() || 
    this.userSettings.loading()
  );

  constructor(
    private serviceSettings: ServiceSettingsServiceSettingService,
    private accountSettings: ServiceSettingsAccountSettingService,
    private userSettings: ServiceSettingsUserSettingService,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
  }

  /**
   * Get effective setting value with cascading priority:
   * User → Account → Service → Default
   * 
   * @param key Setting key
   * @param defaultValue Default value if not found at any level
   * @returns Effective value
   */
  getValue<T>(key: string, defaultValue?: T): T | undefined {
    // Try user settings first (highest priority)
    const userValue = this.userSettings.getValue<T>(key);
    if (userValue !== undefined) {
      this.logger.debug(`Setting '${key}' resolved from user level`);
      return userValue;
    }

    // Try account settings
    const accountValue = this.accountSettings.getValue<T>(key);
    if (accountValue !== undefined) {
      this.logger.debug(`Setting '${key}' resolved from account level`);
      return accountValue;
    }

    // Try service settings
    const serviceValue = this.serviceSettings.getValue<T>(key);
    if (serviceValue !== undefined) {
      this.logger.debug(`Setting '${key}' resolved from service level`);
      return serviceValue;
    }

    // Return default
    this.logger.debug(`Setting '${key}' not found, using default`);
    return defaultValue;
  }

  /**
   * Get the source level of a setting
   */
  getValueSource(key: string): 'user' | 'account' | 'service' | 'default' {
    if (this.userSettings.getValue(key) !== undefined) return 'user';
    if (this.accountSettings.getValue(key) !== undefined) return 'account';
    if (this.serviceSettings.getValue(key) !== undefined) return 'service';
    return 'default';
  }

  /**
   * Load all settings from all levels
   */
  loadAll() {
    this.serviceSettings.loadSettings();
    this.accountSettings.loadSettings();
    this.userSettings.loadSettings();
  }

  /**
   * Refresh all settings
   */
  refreshAll() {
    this.serviceSettings.refresh();
    this.accountSettings.refresh();
    this.userSettings.refresh();
  }
}
