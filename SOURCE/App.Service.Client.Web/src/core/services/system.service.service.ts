// Rx:
//
// Ag:
import { Injectable } from '@angular/core';
// Etc:
//
// Constants:
//
// Services//
import { SystemEnvironmentService } from './system.environment.service';
import { appsConfiguration } from '../../apps/configuration/implementations/apps.configuration';

// Models:
//
// Data:
//
// Describe the service:
@Injectable({ providedIn: 'root' })

// Injectable service to describe current environment
export class ServiceService {
  // Make system/env variables avaiable to class & view template:

  public id: string;
  constructor(systemEnvironmentService: SystemEnvironmentService) {
    // TODO: Make dynamic
    this.id = appsConfiguration.description.title
  }
}
