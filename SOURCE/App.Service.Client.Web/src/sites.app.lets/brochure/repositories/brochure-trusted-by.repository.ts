import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { BrochureTrustedByDto } from '../models/dtos/brochure-trusted-by.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class BrochureTrustedByRepository extends RepositoryService<BrochureTrustedByDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_service_TrustedBy', logger, errorService);
  }

  getEnabled(): Observable<BrochureTrustedByDto[]> {
    return this.query({ enabled: true });
  }
}
