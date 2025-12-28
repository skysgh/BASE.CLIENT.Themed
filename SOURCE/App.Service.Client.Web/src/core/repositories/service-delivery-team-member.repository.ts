import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceDeliveryTeamMemberDto } from '../models/dtos/service-delivery-team-member.dto';
import { RepositoryService } from './base/repository.service';

@Injectable({ providedIn: 'root' })
export class ServiceDeliveryTeamMemberRepository extends RepositoryService<ServiceDeliveryTeamMemberDto> {
  constructor(http: HttpClient) {
    super(http, 'base_service_DeliveryTeamMembers');
  }
}
