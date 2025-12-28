import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceTextMediaEncodingTypeDto } from '../models/dtos/service-text-media-encoding-type.dto';
import { RepositoryService } from './base/repository.service';

@Injectable({ providedIn: 'root' })
export class ServiceTextMediaEncodingTypeRepository extends RepositoryService<ServiceTextMediaEncodingTypeDto> {
  constructor(http: HttpClient) {
    super(http, 'base_service_TextMediaEncodingTypes');
  }
}
