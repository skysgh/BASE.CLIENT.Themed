//// Rx:
////
//// Ag:
//import { Injectable } from '@angular/core';
//import { SystemConfigurationService } from './configuration.service';
//import { TBaseConfiguration } from '../base/configuration/t.base.configuration';
//// Etc:
////
//// Constants:
////
//// Services:
////
//// Model:
////
//// Data:
////

//// Describe the service:
//@Injectable({ providedIn: 'root' })
//export class SystemService<TConfig = TBaseConfiguration> {

//  // Make system/env variables avaiable to class & view template:
//  // public system :ISystem = importedSystemConst;

//  // TODO: update to refer to configuration
//  public system: TConfig;

//  /**
//   * Constructor.
//   * 
//   * @param configurationService
//   */
//  constructor(
//    private configurationService : SystemConfigurationService
//    /* do NOT add diagnostics or error services here, they are not available yet */
//    ) {
//    // Make system/env variables avaiable to view template (via singleton or service):
    
//    this.system = this.configurationService.getConfig() as TConfig;
//  }


//}
