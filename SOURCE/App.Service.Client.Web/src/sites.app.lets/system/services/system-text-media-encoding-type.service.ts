import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SystemTextMediaEncodingTypeRepository } from '../repositories/system-text-media-encoding-type.repository';
import { SystemTextMediaEncodingTypeViewModel } from '../models/view-models/system-text-media-encoding-type.view-model';
import { mapSystemTextMediaEncodingTypeDtosToViewModels } from '../mappers/system-text-media-encoding-type.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class SystemTextMediaEncodingTypeService {
  encodingTypes = signal<SystemTextMediaEncodingTypeViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  constructor(
    private repository: SystemTextMediaEncodingTypeRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadEncodingTypes();
  }
  
  loadEncodingTypes() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapSystemTextMediaEncodingTypeDtosToViewModels(dtos);
          this.encodingTypes.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} encoding types`);
        },
        error: () => {
          this.error.set('Failed to load encoding types');
          this.loading.set(false);
        }
      })
    ).subscribe();
  }
  
  getByCode(code: string): SystemTextMediaEncodingTypeViewModel | undefined {
    return this.encodingTypes().find(et => et.code === code);
  }
  
  refresh() {
    this.loadEncodingTypes();
  }
}
