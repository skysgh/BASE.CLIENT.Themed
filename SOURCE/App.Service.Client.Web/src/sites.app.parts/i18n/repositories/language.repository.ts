/**
 * Language Repository
 * 
 * API communication for languages.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { LanguageDto, UpdateLanguageDto } from '../models/language.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class LanguageRepository extends RepositoryService<LanguageDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_service_Languages', logger, errorService);
  }

  /** Get enabled languages */
  getEnabled(): Observable<LanguageDto[]> {
    return this.query({ enabled: true });
  }

  /** Toggle language enabled status */
  toggleEnabled(id: string, enabled: boolean): Observable<LanguageDto> {
    return this.patch(id, { enabled });
  }
}
