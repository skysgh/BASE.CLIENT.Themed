import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SystemUserDto } from '../models/dtos/system-user.dto';
import { RepositoryService } from './base/repository.service';

@Injectable({ providedIn: 'root' })
export class SystemUserRepository extends RepositoryService<SystemUserDto> {
  constructor(http: HttpClient) {
    super(http, 'base_system_Users');
  }
}
