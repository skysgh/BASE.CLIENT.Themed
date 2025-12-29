import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { StatementDto } from '../models/dtos/statement.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class StatementRepository extends RepositoryService<StatementDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_service_Statements', logger, errorService);
  }

  getEnabled(): Observable<StatementDto[]> {
    return this.query({ enabled: true });
  }

  getByType(typeFK: string): Observable<StatementDto[]> {
    return this.query({ typeFK, enabled: true });
  }

  getByLanguage(languageCode: string): Observable<StatementDto[]> {
    return this.query({ languageCode, enabled: true });
  }

  getServiceLevel(): Observable<StatementDto[]> {
    // Service-level statements have no accountFK
    return this.query({ enabled: true });
  }

  getForAccount(accountFK: string): Observable<StatementDto[]> {
    return this.query({ accountFK, enabled: true });
  }
}
