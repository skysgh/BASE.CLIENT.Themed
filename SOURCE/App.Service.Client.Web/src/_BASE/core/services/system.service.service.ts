// Rx:
//
// Ag:
import { Injectable } from '@angular/core';
// Etc:
// 
// Constants:
import { system as importedSystemConst } from '../constants/system';
// Services//
import { SystemEnvironmentService } from './system.environment.service';

// Models:
//
// Data:
//
// Describe the service:
@Injectable({ providedIn: 'root' })

// Injectable service to describe current environment
export class ServiceService {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  public id: string;
  constructor(systemEnvironmentService: SystemEnvironmentService) {
    // TODO: Make dynamic
    this.id = this.system.dynamic.service.id
  }
}
