import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { BrochurePricingPlanDto } from '../models/dtos/brochure-pricing-plan.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class BrochurePricingPlanRepository extends RepositoryService<BrochurePricingPlanDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_service_PricingPlans', logger, errorService);
  }

  getEnabled(): Observable<BrochurePricingPlanDto[]> {
    return this.query({ enabled: true });
  }

  getByInterval(interval: string): Observable<BrochurePricingPlanDto[]> {
    return this.query({ interval });
  }
}
