import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { RepositoryService } from './base/repository.service';
import { ServiceEndorsementDto } from '../models/dtos/service-endorsement.dto';
import { SystemDiagnosticsTraceService } from '../services/system.diagnostics-trace.service';
import { SystemErrorService } from '../services/system.error.service';

@Injectable({ providedIn: 'root' })
export class ServiceEndorsementRepository extends RepositoryService<ServiceEndorsementDto> {
  
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_service_Endorsements', logger, errorService);
  }

  getEnabled(): Observable<ServiceEndorsementDto[]> {
    return this.query({ enabled: true });
  }
}
