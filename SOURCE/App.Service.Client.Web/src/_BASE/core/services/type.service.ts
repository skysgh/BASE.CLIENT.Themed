// Rx:
//
// Ag:
import { Injectable } from "@angular/core";
// Etc:
//
// Constants:
import { system as importedSystemConst } from '../constants/system';
// Services:
import { SystemDiagnosticsTraceService } from "./system.diagnostics-trace.service";
/**
 * Infrastructure Service to provide assistance
 * with managing Types in Typescript.
 *
 * Quick lessons:
 * Avoid the use of 'any' in preference of 'unknown'.
 * (as it removes the benefit of type checking)
 */
@Injectable({ providedIn: 'root' })
export class TypeService {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)

  }

  /**
   * Method to create a Generic.
   * @param type
   * @returns
   */
  public create<T>(): T {
    var result = {} as T;
    return result;
  }


  //public isInterfaceType(obj: any): boolean {
  //  obj is typeof (TInterface);
  //}
  //public isInterfaceType<TInterface>(obj: any) : boolean{
  //  obj is typeof (TInterface);
  //}

  public isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  /**
   * A method (more of an example really)
   * of how to check whether an object
   * has a defined property
   * @param obj
   * @param fieldName
   * @returns
   */
  public hasProperty(obj: unknown, prop: string): obj is { [key: string]: unknown } {
    // better than using obj![prop], use 'in':
    return typeof obj === 'object' && obj !== null && prop in obj;
  }

  /**
   * Get the name of the instance's type.
   * 
   * Essentially: `instance?.constructor.name`
   * @param instance
   */
  public getTypeName(instance:unknown) :string|null{
    return (instance)
      ? instance.constructor.name
      : null; 
  }

  /**
   * IMPORANT: 'typeof' is notably shallow, and will only return
   * boolean
   * string
   * bigint
   * symbol
   * undefined
   * function
   * number
   * and otherwise will return 'object'.
   * @param instance
   */
  public getType(instance: any) {

  }


}
