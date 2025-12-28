import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AgreementTypeRepository } from '../repositories/agreement-type.repository';
import { AgreementTypeViewModel } from '../models/view-models/agreement-type.view-model';
import { mapAgreementTypeDtosToViewModels } from '../mappers/agreement-type.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class AgreementTypeService {
  agreementTypes = signal<AgreementTypeViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  typeCount = computed(() => this.agreementTypes().length);
  hasTypes = computed(() => this.agreementTypes().length > 0);
  
  constructor(
    private repository: AgreementTypeRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadAgreementTypes();
  }
  
  loadAgreementTypes() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapAgreementTypeDtosToViewModels(dtos);
          this.agreementTypes.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} agreement types`);
        },
        error: (err) => {
          this.error.set('Failed to load agreement types');
          this.loading.set(false);
          this.logger.error(`Error loading agreement types: ${err?.message || err}`);
        }
      })
    ).subscribe();
  }
  
  getById(id: string): AgreementTypeViewModel | undefined {
    return this.agreementTypes().find(type => type.id === id);
  }
  
  refresh() {
    this.loadAgreementTypes();
  }
}
