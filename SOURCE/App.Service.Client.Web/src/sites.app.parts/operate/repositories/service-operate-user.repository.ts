import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { ServiceOperateUserDto } from '../models/dtos/service-operate-user.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class ServiceOperateUserRepository extends RepositoryService<ServiceOperateUserDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_system_Users', logger, errorService);
  }
}
