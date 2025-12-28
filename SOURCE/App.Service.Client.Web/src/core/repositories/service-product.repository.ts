import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceProductDto } from '../models/dtos/service-product.dto';
import { RepositoryService } from './base/repository.service';

@Injectable({ providedIn: 'root' })
export class ServiceProductRepository extends RepositoryService<ServiceProductDto> {
  constructor(http: HttpClient) {
    super(http, 'base_service_Products');
  }
}
