import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { RepositoryService } from './base/repository.service';
import { ServiceTrustedByDto } from '../models/dtos/service-trusted-by.dto';
import { SystemDiagnosticsTraceService } from '../services/system.diagnostics-trace.service';
import { SystemErrorService } from '../services/system.error.service';

@Injectable({ providedIn: 'root' })
export class ServiceTrustedByRepository extends RepositoryService<ServiceTrustedByDto> {
  
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_service_TrustedBy', logger, errorService);
  }

  getEnabled(): Observable<ServiceTrustedByDto[]> {
    return this.query({ enabled: true });
  }
}
