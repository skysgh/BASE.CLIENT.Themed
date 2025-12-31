import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { ServiceSettingsAccountSettingDto } from '../models/dtos/service-settings-account-setting.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class ServiceSettingsAccountSettingRepository extends RepositoryService<ServiceSettingsAccountSettingDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_settings_AccountSettings', logger, errorService);
  }

  getByAccountId(accountId: string): Observable<ServiceSettingsAccountSettingDto[]> {
    return this.query({ accountId });
  }

  getByCategory(accountId: string, category: string): Observable<ServiceSettingsAccountSettingDto[]> {
    return this.query({ accountId, category });
  }
}
