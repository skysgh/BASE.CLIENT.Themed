import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ServiceSettingsAccountSettingRepository } from '../repositories/service-settings-account-setting.repository';
import { ServiceSettingsAccountSettingViewModel } from '../models/view-models/service-settings-account-setting.view-model';
import { mapServiceSettingsAccountSettingDtosToViewModels } from '../mappers/service-settings-account-setting.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { AccountService } from '../../../core/services/account.service';

/**
 * Account Settings Service
 * Manages per-tenant settings (account admin)
 */
@Injectable({ providedIn: 'root' })
export class ServiceSettingsAccountSettingService {
  settings = signal<ServiceSettingsAccountSettingViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  settingsByCategory = computed(() => {
    const grouped: Record<string, ServiceSettingsAccountSettingViewModel[]> = {};
    this.settings().forEach(s => {
      if (!grouped[s.category]) grouped[s.category] = [];
      grouped[s.category].push(s);
    });
    return grouped;
  });

  constructor(
    private repository: ServiceSettingsAccountSettingRepository,
    private accountService: AccountService,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
  }

  loadSettings() {
    const accountGuid = this.accountService.getAccountGuid();
    if (!accountGuid) {
      this.logger.warn('No account GUID available, cannot load account settings');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    return this.repository.getByAccountId(accountGuid).pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapServiceSettingsAccountSettingDtosToViewModels(dtos);
          this.settings.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} account settings`);
        },
        error: () => {
          this.error.set('Failed to load account settings');
          this.loading.set(false);
        }
      })
    ).subscribe();
  }

  getValue<T>(key: string): T | undefined {
    const setting = this.settings().find(s => s.key === key);
    return setting?.value as T | undefined;
  }

  refresh() {
    this.loadSettings();
  }
}
