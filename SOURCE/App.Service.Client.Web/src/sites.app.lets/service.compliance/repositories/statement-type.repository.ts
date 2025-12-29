import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { StatementTypeDto } from '../models/dtos/statement-type.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class StatementTypeRepository extends RepositoryService<StatementTypeDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_service_StatementTypes', logger, errorService);
  }

  getEnabled(): Observable<StatementTypeDto[]> {
    return this.query({ enabled: true });
  }

  getByCode(code: string): Observable<StatementTypeDto[]> {
    return this.query({ code });
  }
}
