import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AgreementRepository } from '../repositories/agreement.repository';
import { AgreementViewModel } from '../models/view-models/agreement.view-model';
import { mapAgreementDtosToViewModels } from '../mappers/agreement.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
import { AgreementTypeService } from './agreement-type.service';

@Injectable({ providedIn: 'root' })
export class AgreementService {
  agreements = signal<AgreementViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  agreementCount = computed(() => this.agreements().length);
  hasAgreements = computed(() => this.agreements().length > 0);
  
  constructor(
    private repository: AgreementRepository,
    private agreementTypeService: AgreementTypeService,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadAgreements();
  }
  
  loadAgreements() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const getTypeName = (typeId: string) => {
            const type = this.agreementTypeService.getById(typeId);
            return type?.title || 'Unknown Type';
          };
          
          const viewModels = mapAgreementDtosToViewModels(dtos, getTypeName);
          this.agreements.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} agreements`);
        },
        error: (err) => {
          this.error.set('Failed to load agreements');
          this.loading.set(false);
          this.logger.error(`Error loading agreements: ${err?.message || err}`);
        }
      })
    ).subscribe();
  }
  
  getByTypeId(typeId: string): AgreementViewModel[] {
    return this.agreements().filter(agreement => agreement.typeId === typeId);
  }
  
  getById(id: string): AgreementViewModel | undefined {
    return this.agreements().find(agreement => agreement.id === id);
  }
  
  refresh() {
    this.loadAgreements();
  }
}
