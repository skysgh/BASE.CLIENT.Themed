import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { BrochureFeatureRepository } from '../repositories/brochure-feature.repository';
import { BrochureFeatureViewModel } from '../models/view-models/brochure-feature.view-model';
import { mapBrochureFeatureDtosToViewModels } from '../mappers/brochure-feature.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class BrochureFeatureService {
  readonly features = signal<BrochureFeatureViewModel[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly enabledFeatures = computed(() => this.features().filter(f => f.isEnabled));
  readonly totalCount = computed(() => this.features().length);

  constructor(
    private repository: BrochureFeatureRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadFeatures();
  }

  loadFeatures(): Observable<BrochureFeatureViewModel[]> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      map(dtos => mapBrochureFeatureDtosToViewModels(dtos)),
      tap(vms => {
        this.features.set(vms);
        this.loading.set(false);
        this.logger.debug(`Loaded ${vms.length} features`);
      }),
      catchError(err => {
        this.error.set('Failed to load features');
        this.loading.set(false);
        return of([]);
      })
    );
  }

  refresh(): Observable<BrochureFeatureViewModel[]> {
    return this.loadFeatures();
  }

  getById(id: string): BrochureFeatureViewModel | undefined {
    return this.features().find(f => f.id === id);
  }
}
