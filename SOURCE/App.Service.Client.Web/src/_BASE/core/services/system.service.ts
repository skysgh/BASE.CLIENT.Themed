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

  // Expose public property of
  // system environment.
  // From there, can get access to base service url. 
  public system = importedSystemConst;;

  constructor() {
  }
}
