import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgreementTypeDto } from '../models/dtos/agreement-type.dto';
import { RepositoryService } from './base/repository.service';

@Injectable({ providedIn: 'root' })
export class AgreementTypeRepository extends RepositoryService<AgreementTypeDto> {
  constructor(http: HttpClient) {
    super(http, 'base_agreementTypes');
  }
}
