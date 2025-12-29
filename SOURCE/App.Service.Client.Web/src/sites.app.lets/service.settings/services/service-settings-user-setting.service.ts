import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ServiceSettingsUserSettingRepository } from '../repositories/service-settings-user-setting.repository';
import { ServiceSettingsUserSettingViewModel } from '../models/view-models/service-settings-user-setting.view-model';
import { mapServiceSettingsUserSettingDtosToViewModels } from '../mappers/service-settings-user-setting.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';

/**
 * User Settings Service
 * Manages per-user preferences (all users)
 */
@Injectable({ providedIn: 'root' })
export class ServiceSettingsUserSettingService {
  settings = signal<ServiceSettingsUserSettingViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  settingsByCategory = computed(() => {
    const grouped: Record<string, ServiceSettingsUserSettingViewModel[]> = {};
    this.settings().forEach(s => {
      if (!grouped[s.category]) grouped[s.category] = [];
      grouped[s.category].push(s);
    });
    return grouped;
  });

  constructor(
    private repository: ServiceSettingsUserSettingRepository,
    private tokenStorageService: TokenStorageService,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
  }

  loadSettings() {
    const user = this.tokenStorageService.getUser();
    if (!user?.id) {
      this.logger.warn('No user ID available, cannot load user settings');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    return this.repository.getByUserId(user.id).pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapServiceSettingsUserSettingDtosToViewModels(dtos);
          this.settings.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} user settings`);
        },
        error: () => {
          this.error.set('Failed to load user settings');
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
