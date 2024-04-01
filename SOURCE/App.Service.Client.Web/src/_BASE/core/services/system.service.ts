// Rx:
//
// Ag:
import { Injectable } from '@angular/core';
// Etc:
//
// Constants:
import { system as importedSystemConst } from '../constants/system';
// Services:
//
// Model:
//
// Data:
//

// Describe the service:
@Injectable({ providedIn: 'root' })
export class SystemService {
  // Make system/env variables avaiable to view template:
  public system = importedSystemConst;;

  constructor() {
    // Make system/env variables avaiable to view template (via const or service):
    // this.system = systemService.system;
  }
}
