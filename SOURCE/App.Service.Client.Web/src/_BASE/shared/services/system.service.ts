// Import dependencies:
import { Injectable } from '@angular/core';
import { system } from "../constants/system";


// Describe the service:
@Injectable({ providedIn: 'root' })
export class SystemService {

  // Expose public property of
  // system environment.
  // From there, can get access to base service url. 
  public system;

  constructor() {
    this.system = system;
  }
}
