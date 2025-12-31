import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { ServiceDescribeDeliveryTeamMemberDto } from '../models/dtos/service-describe-delivery-team-member.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class ServiceDescribeDeliveryTeamMemberRepository extends RepositoryService<ServiceDescribeDeliveryTeamMemberDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_service_DeliveryTeamMembers', logger, errorService);
  }

  getEnabled(): Observable<ServiceDescribeDeliveryTeamMemberDto[]> {
    return this.query({ enabled: true });
  }
}
