import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { ServiceDescribeFeatureRepository } from '../repositories/service-describe-feature.repository';
import { ServiceDescribeFeatureViewModel } from '../models/view-models/service-describe-feature.view-model';
import { mapServiceDescribeFeatureDtosToViewModels } from '../mappers/service-describe-feature.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ServiceDescribeFeatureService {
  readonly features = signal<ServiceDescribeFeatureViewModel[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly enabledFeatures = computed(() => this.features().filter(f => f.isEnabled));
  readonly totalCount = computed(() => this.features().length);

  constructor(
    private repository: ServiceDescribeFeatureRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadFeatures();
  }

  loadFeatures(): Observable<ServiceDescribeFeatureViewModel[]> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      map(dtos => mapServiceDescribeFeatureDtosToViewModels(dtos)),
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

  refresh(): Observable<ServiceDescribeFeatureViewModel[]> {
    return this.loadFeatures();
  }

  getById(id: string): ServiceDescribeFeatureViewModel | undefined {
    return this.features().find(f => f.id === id);
  }
}
