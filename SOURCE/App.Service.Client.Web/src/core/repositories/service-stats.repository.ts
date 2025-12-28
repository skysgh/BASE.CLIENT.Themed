import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RepositoryService } from './base/repository.service';
import { ServiceStatsDto } from '../models/dtos/service-stats.dto';
import { SystemDiagnosticsTraceService } from '../services/system.diagnostics-trace.service';
import { SystemErrorService } from '../services/system.error.service';

@Injectable({ providedIn: 'root' })
export class ServiceStatsRepository extends RepositoryService<ServiceStatsDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_service_stats', logger, errorService);
  }
}
