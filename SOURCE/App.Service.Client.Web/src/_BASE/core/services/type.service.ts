// Rx:
//
// Ag:
import { Injectable } from "@angular/core";
// Etc:
//
// Constants:
import { system as importedSystemConst } from '../constants/system';
// Services:
import { DiagnosticsTraceService } from "./diagnostics.service";
// Models:
//
// Data:
//

@Injectable({ providedIn: 'root' })
export class TypeService {

  constructor(private diagnosticsTraceService: DiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)

  }

  create<T>(type: (new () => T)): T {
    return new type();
  }

  isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  // Check first:
  hasProperty(obj: unknown, prop: string): obj is { [key: string]: unknown } {
    return typeof obj === 'object' && obj !== null && prop in obj;
  }
  public getTypeName(instance:any) {
    return instance.constructor.name; 
  }
}
