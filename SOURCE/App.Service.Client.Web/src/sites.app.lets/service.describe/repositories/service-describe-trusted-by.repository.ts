import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { ServiceDescribeTrustedByDto } from '../models/dtos/service-describe-trusted-by.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class ServiceDescribeTrustedByRepository extends RepositoryService<ServiceDescribeTrustedByDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_service_TrustedBy', logger, errorService);
  }

  getEnabled(): Observable<ServiceDescribeTrustedByDto[]> {
    return this.query({ enabled: true });
  }
}
