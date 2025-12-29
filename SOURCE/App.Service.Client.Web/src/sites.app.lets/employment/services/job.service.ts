import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { JobRepository } from '../repositories/job.repository';
import { JobViewModel } from '../models/view-models/job.view-model';
import { mapJobDtosToViewModels } from '../mappers/job.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class JobService {
  jobs = signal<JobViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  jobCount = computed(() => this.jobs().length);
  hasJobs = computed(() => this.jobs().length > 0);
  bookmarkedJobs = computed(() => this.jobs().filter(j => j.isBookmarked));
  
  constructor(
    private repository: JobRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadJobs();
  }
  
  loadJobs() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapJobDtosToViewModels(dtos);
          this.jobs.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} jobs`);
        },
        error: () => {
          this.error.set('Failed to load jobs');
          this.loading.set(false);
        }
      })
    ).subscribe();
  }
  
  getById(id: string): JobViewModel | undefined {
    return this.jobs().find(j => j.id === id);
  }
  
  toggleBookmark(id: string) {
    this.jobs.update(all =>
      all.map(j => j.id === id ? { ...j, isBookmarked: !j.isBookmarked } : j)
    );
  }
  
  refresh() {
    this.loadJobs();
  }
}
