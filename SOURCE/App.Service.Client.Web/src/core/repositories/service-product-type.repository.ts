import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceProductTypeDto } from '../models/dtos/service-product-type.dto';
import { RepositoryService } from './base/repository.service';

@Injectable({ providedIn: 'root' })
export class ServiceProductTypeRepository extends RepositoryService<ServiceProductTypeDto> {
  constructor(http: HttpClient) {
    super(http, 'base_service_ProductTypes');
  }
}
