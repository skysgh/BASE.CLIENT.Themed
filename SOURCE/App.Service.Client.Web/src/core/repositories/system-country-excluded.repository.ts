import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SystemCountryExcludedDto } from '../models/dtos/system-country-excluded.dto';
import { RepositoryService } from './base/repository.service';

@Injectable({ providedIn: 'root' })
export class SystemCountryExcludedRepository extends RepositoryService<SystemCountryExcludedDto> {
  constructor(http: HttpClient) {
    super(http, 'base_System_CountriesExcluded');
  }

  getByEmbargoId(embargoId: string): Observable<SystemCountryExcludedDto[]> {
    return this.getFiltered({ embargoFk: embargoId });
  }
}
