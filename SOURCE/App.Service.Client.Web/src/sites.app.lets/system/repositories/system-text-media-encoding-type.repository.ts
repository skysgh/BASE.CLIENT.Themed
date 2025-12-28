import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { SystemTextMediaEncodingTypeDto } from '../models/dtos/system-text-media-encoding-type.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class SystemTextMediaEncodingTypeRepository extends RepositoryService<SystemTextMediaEncodingTypeDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_system_TextMediaEncodingTypes', logger, errorService);
  }
}
