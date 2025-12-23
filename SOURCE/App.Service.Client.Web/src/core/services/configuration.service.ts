// Rx:
//
// Ag:
import { Injectable } from "@angular/core";
// Types:
import { TBaseConfiguration } from "../base/configuration/t.base.configuration";
// Singletons:
import { environment } from "../../environments/environment";
// Services:
//For now: import { SystemDiagnosticsTraceService } from "./system.diagnostics-trace.service";
import { ObjectService } from "./object.service";




/**
 * Service to return the app's configuration object,
 * and by extension the configuration instance for each
 * root area (apps, sites, themes, coreAg, core, etc.)
 */

@Injectable({ providedIn: 'root' })
export class SystemConfigurationService<TConfig = TBaseConfiguration> {


  // private config: ExtendedConfig = { ...BASE_CONFIG };

  /** The private config object */
  private config: TConfig = {} as TConfig;

  /**
   * Constructor
   * @param diagnosticsTraceService
   */
  constructor(
    /* DO NOT INJECT DefaultServices as that would cycle */
    //private diagnosticsTraceService: SystemDiagnosticsTraceService,
    private objectService: ObjectService
  ) {

    //this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
  }


  /**
 * Public *static* function that can be invoked from an AppModule:
 * 
 * providers: [
 *              ConfigurationService,
 *              {
 *                  provide: APP_INITIALIZER,
 *                  useFactory: ConfigurationService.loadConfig,
 *                  deps: [ConfigurationService],
 *                  multi: true,
 *              },
 * ];
 * @param configurationService
 * @returns
 */
  public static loadConfig(
    configurationService: SystemConfigurationService
  ) {

    var sourceUrl = environment.custom.configFileUrl;

    return () =>
      fetch(sourceUrl) // Fetch the configuration file
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load '${sourceUrl}': ${response.statusText}`);
          }
          return response.json(); // Parse the JSON
        })
        .then(runtimeConfig => {
          configurationService.setConfig(runtimeConfig); // Set it in the ConfigService
        });
  }




  /**
   * Set the State (in this case the Config object)
   * with an T that derives from it.
   * @param configOverrides
   */
  setConfig(configOverrides: Partial<TBaseConfiguration>): void {
    // Shallow merge:
    //this.config = { ...this.config, ...config };
    // Deep merge:
    this.objectService.deepMerge(this.config, configOverrides);
  }
  /**
   * Get whole config object including nested objects and properties
   * 
   */
  getConfig(): TConfig {
    return this.config as TConfig;
  }


  /**
   * Get a single value from the config object.
   * Accepts "dot" notation for nested objects.
   */
  // Overload for generic type inference
  getConfigValue<T>(key: string, defaultValue: T): T;

  // Overload for untyped usage
  getConfigValue(key: string, defaultValue?: any): any;

  // Implementation
  getConfigValue<T>(
    key: string,
    defaultValue: T = undefined as T,
    currentConfig: any = this.config
  ): T {
    return this.objectService.getValue<T>(key, defaultValue, currentConfig);
  }
}


