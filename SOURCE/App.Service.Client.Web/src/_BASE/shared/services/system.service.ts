// Import dependencies:
import { Injectable } from '@angular/core';
import { system } from '../settings/constants/system';
import { System } from '../models/system.model';

// Describe the service:
@Injectable({ providedIn: 'root' })
export class SystemService {

  // Expose public property of
  // system environment.
  // From there, can get access to base service url. 
  public system: System;

  constructor() {
    this.system = system;
  }
}
