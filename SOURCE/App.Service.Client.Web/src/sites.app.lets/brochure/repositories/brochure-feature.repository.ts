import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { BrochureFeatureDto } from '../models/dtos/brochure-feature.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class BrochureFeatureRepository extends RepositoryService<BrochureFeatureDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/base_service_Features', logger, errorService);
  }

  getEnabled(): Observable<BrochureFeatureDto[]> {
    return this.query({ enabled: true });
  }

  getByServiceId(serviceId: string): Observable<BrochureFeatureDto[]> {
    return this.query({ serviceId });
  }

  toggleEnabled(id: string, enabled: boolean): Observable<BrochureFeatureDto> {
    return this.patch(id, { enabled });
  }
}
