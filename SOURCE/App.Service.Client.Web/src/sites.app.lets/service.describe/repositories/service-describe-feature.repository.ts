import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { ServiceDescribeFeatureDto } from '../models/dtos/service-describe-feature.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class ServiceDescribeFeatureRepository extends RepositoryService<ServiceDescribeFeatureDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/base_service_Features', logger, errorService);
  }

  getEnabled(): Observable<ServiceDescribeFeatureDto[]> {
    return this.query({ enabled: true });
  }

  getByServiceId(serviceId: string): Observable<ServiceDescribeFeatureDto[]> {
    return this.query({ serviceId });
  }

  toggleEnabled(id: string, enabled: boolean): Observable<ServiceDescribeFeatureDto> {
    return this.patch(id, { enabled });
  }
}
