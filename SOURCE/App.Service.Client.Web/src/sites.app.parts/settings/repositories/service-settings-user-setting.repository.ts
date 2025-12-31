import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { ServiceSettingsUserSettingDto } from '../models/dtos/service-settings-user-setting.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class ServiceSettingsUserSettingRepository extends RepositoryService<ServiceSettingsUserSettingDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_settings_UserSettings', logger, errorService);
  }

  getByUserId(userId: string): Observable<ServiceSettingsUserSettingDto[]> {
    return this.query({ userId });
  }

  getByCategory(userId: string, category: string): Observable<ServiceSettingsUserSettingDto[]> {
    return this.query({ userId, category });
  }
}
