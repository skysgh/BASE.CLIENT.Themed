import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { TextMediaEncodingTypeDto } from '../models/dtos/text-media-encoding-type.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class TextMediaEncodingTypeRepository extends RepositoryService<TextMediaEncodingTypeDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_service_TextMediaEncodingTypes', logger, errorService);
  }

  getEnabled(): Observable<TextMediaEncodingTypeDto[]> {
    return this.query({ enabled: true });
  }

  getByCode(code: string): Observable<TextMediaEncodingTypeDto[]> {
    return this.query({ code });
  }
}
