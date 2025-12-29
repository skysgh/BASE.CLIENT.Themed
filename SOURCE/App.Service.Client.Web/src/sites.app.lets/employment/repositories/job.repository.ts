import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { JobDto } from '../models/dtos/job.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class JobRepository extends RepositoryService<JobDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_employment_Jobs', logger, errorService);
  }

  getEnabled(): Observable<JobDto[]> {
    return this.query({ enabled: true });
  }

  getByLocation(location: string): Observable<JobDto[]> {
    return this.query({ location });
  }
}
