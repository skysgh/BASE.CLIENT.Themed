import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { BrochureFaqDto } from '../models/dtos/brochure-faq.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class BrochureFaqRepository extends RepositoryService<BrochureFaqDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_service_Faqs', logger, errorService);
  }

  getEnabled(): Observable<BrochureFaqDto[]> {
    return this.query({ enabled: true });
  }

  getByCategory(categoryId: string): Observable<BrochureFaqDto[]> {
    return this.query({ categoryId });
  }
}
