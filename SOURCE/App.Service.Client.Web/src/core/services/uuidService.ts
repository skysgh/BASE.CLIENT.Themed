// Rx:
//
// Ag:
import { Injectable } from '@angular/core';
// Etc:
//
// Constants:
import { system as importedSystemConst } from '../constants/system';
// Services:
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
// Models:
import { v4 as uuidv4 } from 'uuid';
import { NIL as NIL_UUID } from 'uuid';
// Data:

/**
 * Root registered injectable service
 * to provide UUID functionality.
 * While it may not be always possible, prefer
 * not dragging dependancies to 3rd party libraries
 * all around the code base, by wrapping it
 * in an app specific service. 
 */

@Injectable({ providedIn: 'root' })
export class UUIDService {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
  }

  getNullUUID() {
    return NIL_UUID;
  }
/**
 * generate groups of 4 random characters
 * @example getUniqueId(1) : 607f
 * @example getUniqueId(2) : 95ca-361a
 * @example getUniqueId(4) : 6a22-a5e6-3489-896b
 */
  getUUID(): string {
    return uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
  }
  //validate() {
  //  uuid.validate();
  //}

  getUniqueId(parts: number): string {
    const stringArr = [];
    for (let i = 0; i < parts; i++) {
      // tslint:disable-next-line:no-bitwise
      const S4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      stringArr.push(S4);
    }
    return stringArr.join('-');
  }
}
