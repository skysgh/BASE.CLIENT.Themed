import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ServiceSettingsServiceSettingRepository } from '../repositories/service-settings-service-setting.repository';
import { ServiceSettingsServiceSettingViewModel } from '../models/view-models/service-settings-service-setting.view-model';
import { mapServiceSettingsServiceSettingDtosToViewModels } from '../mappers/service-settings-service-setting.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

/**
 * Service Settings Service
 * Manages platform-wide settings (super admin only)
 */
@Injectable({ providedIn: 'root' })
export class ServiceSettingsServiceSettingService {
  settings = signal<ServiceSettingsServiceSettingViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  settingsByCategory = computed(() => {
    const grouped: Record<string, ServiceSettingsServiceSettingViewModel[]> = {};
    this.settings().forEach(s => {
      if (!grouped[s.category]) grouped[s.category] = [];
      grouped[s.category].push(s);
    });
    return grouped;
  });

  constructor(
    private repository: ServiceSettingsServiceSettingRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
  }

  loadSettings() {
    this.loading.set(true);
    this.error.set(null);

    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapServiceSettingsServiceSettingDtosToViewModels(dtos);
          this.settings.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} service settings`);
        },
        error: () => {
          this.error.set('Failed to load service settings');
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
