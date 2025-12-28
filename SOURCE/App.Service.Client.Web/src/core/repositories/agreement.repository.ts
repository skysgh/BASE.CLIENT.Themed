import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgreementDto } from '../models/dtos/agreement.dto';
import { RepositoryService } from './base/repository.service';

@Injectable({ providedIn: 'root' })
export class AgreementRepository extends RepositoryService<AgreementDto> {
  constructor(http: HttpClient) {
    super(http, 'base_agreements');
  }

  getByTypeId(typeId: string): Observable<AgreementDto[]> {
    return this.getFiltered({ typeId });
  }
}
