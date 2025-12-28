import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { BrochureEndorsementDto } from '../models/dtos/brochure-endorsement.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class BrochureEndorsementRepository extends RepositoryService<BrochureEndorsementDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_service_Endorsements', logger, errorService);
  }

  getEnabled(): Observable<BrochureEndorsementDto[]> {
    return this.query({ enabled: true });
  }
}
