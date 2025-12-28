import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ServiceTextMediaEncodingTypeRepository } from '../repositories/service-text-media-encoding-type.repository';
import { ServiceTextMediaEncodingTypeViewModel } from '../models/view-models/service-text-media-encoding-type.view-model';
import { mapServiceTextMediaEncodingTypeDtosToViewModels } from '../mappers/service-text-media-encoding-type.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ServiceTextMediaEncodingTypeService {
  encodingTypes = signal<ServiceTextMediaEncodingTypeViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  typeCount = computed(() => this.encodingTypes().length);
  hasTypes = computed(() => this.encodingTypes().length > 0);
  htmlType = computed(() => 
    this.encodingTypes().find(type => type.isHtml)
  );
  markdownType = computed(() => 
    this.encodingTypes().find(type => type.isMarkdown)
  );
  
  constructor(
    private repository: ServiceTextMediaEncodingTypeRepository,
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
          const viewModels = mapServiceTextMediaEncodingTypeDtosToViewModels(dtos);
          this.encodingTypes.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} encoding types`);
        },
        error: (err) => {
          this.error.set('Failed to load encoding types');
          this.loading.set(false);
          this.logger.error(`Error loading encoding types: ${err?.message || err}`);
        }
      })
    ).subscribe();
  }
  
  getById(id: string): ServiceTextMediaEncodingTypeViewModel | undefined {
    return this.encodingTypes().find(type => type.id === id);
  }
  
  refresh() {
    this.loadEncodingTypes();
  }
}
