import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SystemEmbargoDto } from '../models/dtos/system-embargo.dto';
import { RepositoryService } from './base/repository.service';

@Injectable({ providedIn: 'root' })
export class SystemEmbargoRepository extends RepositoryService<SystemEmbargoDto> {
  constructor(http: HttpClient) {
    super(http, 'base_system_Embargos');
  }
}
