import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { ServiceSettingsServiceSettingDto } from '../models/dtos/service-settings-service-setting.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class ServiceSettingsServiceSettingRepository extends RepositoryService<ServiceSettingsServiceSettingDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_settings_ServiceSettings', logger, errorService);
  }

  getByCategory(category: string): Observable<ServiceSettingsServiceSettingDto[]> {
    return this.query({ category });
  }

  getByKey(key: string): Observable<ServiceSettingsServiceSettingDto | undefined> {
    return this.query({ key }).pipe(
      map(results => results.length > 0 ? results[0] : undefined)
    );
  }
}
