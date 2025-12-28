import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RepositoryService } from './base/repository.service';
import { ServiceLanguageDto } from '../models/dtos/service-language.dto';
import { SystemDiagnosticsTraceService } from '../services/system.diagnostics-trace.service';
import { SystemErrorService } from '../services/system.error.service';

@Injectable({ providedIn: 'root' })
export class ServiceLanguageRepository extends RepositoryService<ServiceLanguageDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_service_Languages', logger, errorService);
  }
}
