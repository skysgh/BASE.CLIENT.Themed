import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { ServiceDescribeFaqDto } from '../models/dtos/service-describe-faq.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class ServiceDescribeFaqRepository extends RepositoryService<ServiceDescribeFaqDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_service_Faqs', logger, errorService);
  }

  getEnabled(): Observable<ServiceDescribeFaqDto[]> {
    return this.query({ enabled: true });
  }

  getByCategory(categoryId: string): Observable<ServiceDescribeFaqDto[]> {
    return this.query({ categoryId });
  }
}
