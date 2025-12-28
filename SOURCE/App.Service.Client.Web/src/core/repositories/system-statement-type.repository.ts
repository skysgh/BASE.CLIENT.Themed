import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SystemStatementTypeDto } from '../models/dtos/system-statement-type.dto';
import { RepositoryService } from './base/repository.service';

@Injectable({ providedIn: 'root' })
export class SystemStatementTypeRepository extends RepositoryService<SystemStatementTypeDto> {
  constructor(http: HttpClient) {
    super(http, 'base_system_StatementTypes');
  }
}
