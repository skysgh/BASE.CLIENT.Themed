import { Injectable } from "@angular/core";
//import { SystemDiagnosticsTraceService } from "./system.diagnostics-trace.service";

/**
 * Injectable service that provides methods
 * to manage object properties.
 */
@Injectable({ providedIn: 'root' })
export class ObjectService {


  /**
   * Constructor
   */
  constructor(
    /** Do not use DefaultServices (as ConfigService uses this service) */
    //Causes a CDE private diagnosticsTraceService: SystemDiagnosticsTraceService
  ) {
  }

  // Example of shallow merge.
  //this.config = { ...this.config, ...config };

  /**
   * Goes beyond spread (...) operator and Object.assign() method
   * that both are shallow copy methods.
   * @param target
   * @param source
   * @returns
   */
  // Non-generic overload
  public deepMerge(target: any, source: any): any;

  // Generic overload
  public deepMerge<T extends Record<string, any>, U extends Record<string, any>>(
    target: T,
    source: U
  ): T & U;

  // Actual Implementation of above (first) overload:
  public deepMerge(target: any, source: any): any {
    if (!source || typeof source !== 'object') {
      return target; // Return target if source is not an object
    }

    for (const key of Object.keys(source)) {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue)
      ) {
        // Recursive merge
        target[key] = this.deepMerge(targetValue || {}, sourceValue);
      } else {
        target[key] = sourceValue;
      }
    }

    return target;
  }

  public deepMergeJS(target: any, source: any): any {
    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key])
      ) {
        target[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  /**
 * Get value from object by string key.
 * Accepts "dot" notation for nested objects.
 */

  // Overload for generic type inference
  getValue<T>(key: string, defaultValue: T, obj: Record<string, any>): T;

  // Overload for untyped usage
  getValue(key: string, defaultValue?: any, obj?: any): any;

  /**
   * Get value from object by string key.
   * Accepts "dot" notation for nested objects.
   * 
   * @param key
   * @param defaultValue
   * @param currentConfig
   * @returns
   */
  // Implementation
  getValue<T>(key: string, defaultValue: T = undefined as T, obj: any = null): any {
    if (!obj || typeof obj !== 'object') {
      return defaultValue; // Exit if obj is invalid
    }

    const [currentKey, ...remainingKeys] = key.split('.');

    // Exit early if key doesn't exist
    if (!obj.hasOwnProperty(currentKey)) {
      return defaultValue;
    }

    const value = obj[currentKey];

    // If there are more keys, recurse into the nested object
    if (remainingKeys.length > 0) {
      return this.getValue(remainingKeys.join('.'), defaultValue, value);
    }

    // Return the final value if no more keys to process
    return value;
  }
}
