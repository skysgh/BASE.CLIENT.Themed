// Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ✅ NEW: Config Registry
import { ConfigRegistryService } from '../../core/services/config-registry.service';

// Other dependencies:
import { BaseThemesV1Module } from '../../themes/t1/module';

//Module specific:
import { BaseAppsArchitectureRoutingModule } from "./routing.module";
// Parent Module:
import { BaseAppsModule } from '../../sites.app/module';
// Child Modules:
import { BaseAppsArchitectureValuesModule } from "./modules/values/module";

//Module specific components:
import { ArchitectureValuesRepositoryService } from './services/repositories/values-repository.service';

// ✅ NEW: Import architecture constants
import { appletsArchitectureConstants } from './constants/implementations/app.lets.architecture.constants';

@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
  ],
  providers: [
    // declare services to dependency inject into constructors.
    ArchitectureValuesRepositoryService
  ],
  imports: [
    // Import classes within the above specified import files.
    //Ag specific:
    CommonModule,
    FormsModule,
    // Routes:
    BaseAppsArchitectureRoutingModule,
    // SubModules:
    BaseAppsArchitectureValuesModule,
    // Components:
    // ...not yet...
    // Import Parent Module:
    BaseAppsModule
  ],  
  exports: [
    // NO: Export Parent Module: (create's circular condition)
    // NO: BaseAppsModule
  ],
})
export class BaseAppsArchitectureModule {
  /**
   * ✅ NEW: Register Architecture applet
   * 
   * Uses namespaced key: 'applets.architecture'
   * Prevents collision with core tiers.
   */
  constructor(configRegistryService: ConfigRegistryService) {
    configRegistryService.register('applets.architecture', {
      constants: appletsArchitectureConstants
    });
  }
}
