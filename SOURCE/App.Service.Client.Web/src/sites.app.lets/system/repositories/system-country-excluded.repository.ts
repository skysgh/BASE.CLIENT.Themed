import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { SystemCountryExcludedDto } from '../models/dtos/system-country-excluded.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class SystemCountryExcludedRepository extends RepositoryService<SystemCountryExcludedDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_system_CountryExcluded', logger, errorService);
  }
}
