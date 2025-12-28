import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceStatementDto } from '../models/dtos/service-statement.dto';
import { RepositoryService } from './base/repository.service';

@Injectable({ providedIn: 'root' })
export class ServiceStatementRepository extends RepositoryService<ServiceStatementDto> {
  constructor(http: HttpClient) {
    super(http, 'base_service_Statements');
  }

  getByTypeId(typeId: string): Observable<ServiceStatementDto[]> {
    return this.getFiltered({ typeId });
  }

  getByLanguage(languageCode: string): Observable<ServiceStatementDto[]> {
    return this.getFiltered({ languageCode });
  }
}
