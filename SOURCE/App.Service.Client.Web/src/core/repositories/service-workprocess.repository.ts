import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceWorkprocessDto } from '../models/dtos/service-workprocess.dto';
import { RepositoryService } from './base/repository.service';

@Injectable({ providedIn: 'root' })
export class ServiceWorkprocessRepository extends RepositoryService<ServiceWorkprocessDto> {
  constructor(http: HttpClient) {
    super(http, 'base_service_Workprocess');
  }

  getByServiceId(serviceId: string): Observable<ServiceWorkprocessDto[]> {
    return this.getFiltered({ serviceId });
  }
}
