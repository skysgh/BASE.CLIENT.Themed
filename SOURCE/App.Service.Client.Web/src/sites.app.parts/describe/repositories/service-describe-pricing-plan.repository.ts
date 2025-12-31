import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { ServiceDescribePricingPlanDto } from '../models/dtos/service-describe-pricing-plan.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class ServiceDescribePricingPlanRepository extends RepositoryService<ServiceDescribePricingPlanDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_service_PricingPlans', logger, errorService);
  }

  getEnabled(): Observable<ServiceDescribePricingPlanDto[]> {
    return this.query({ enabled: true });
  }

  getByInterval(interval: string): Observable<ServiceDescribePricingPlanDto[]> {
    return this.query({ interval });
  }
}
