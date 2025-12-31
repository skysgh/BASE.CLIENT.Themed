import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { AccountDto } from '../models/dtos/account.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class AccountRepository extends RepositoryService<AccountDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_service_Accounts', logger, errorService);
  }

  getEnabled(): Observable<AccountDto[]> {
    return this.query({ enabled: true });
  }

  getByGuid(accountGuid: string): Observable<AccountDto[]> {
    return this.query({ accountGuid });
  }

  getByName(name: string): Observable<AccountDto[]> {
    return this.query({ name });
  }
}
