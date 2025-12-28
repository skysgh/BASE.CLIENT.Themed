import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RepositoryService } from './base/repository.service';
import { ServicePricingPlanDto } from '../models/dtos/service-pricing-plan.dto';
import { SystemDiagnosticsTraceService } from '../services/system.diagnostics-trace.service';
import { SystemErrorService } from '../services/system.error.service';

@Injectable({ providedIn: 'root' })
export class ServicePricingPlanRepository extends RepositoryService<ServicePricingPlanDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_service_PricingPlans', logger, errorService);
  }
}
