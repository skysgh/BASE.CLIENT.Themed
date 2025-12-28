import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { BrochureStatsDto } from '../models/dtos/brochure-stats.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class BrochureStatsRepository extends RepositoryService<BrochureStatsDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_service_Stats', logger, errorService);
  }

  getEnabled(): Observable<BrochureStatsDto[]> {
    return this.query({ enabled: true });
  }
}
