// Nx
//
// Ag:
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// ✅ Config Registry
import { ConfigRegistryService } from "../core/services/config-registry.service";

// Parent Modules:
import { BaseCoreAgModule } from "../core.ag/module";
// Modules:
import { BaseThemesV1Module } from "./t1/module";

// ✅ Import theme configuration (not inline object!)
import { themesConfiguration } from "./configuration/themes.configuration";


@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
  ],
  providers: [
    // declare services to dependency inject into constructors.
  ],
  imports: [
    CommonModule,
    // Upstream: to Core.Ag which brings in Core. 
    BaseCoreAgModule,
    // Import Parent Module:
    // NO: N/A (at top of column hiearchy)

    // Child Modules:
    BaseThemesV1Module
  ],
  exports: [
    BaseCoreAgModule,
    // NO: Export Parent Module:
    // NO: ...TODO?
    // Child Modules:
    BaseThemesV1Module
  ]
})
export class BaseThemesModule {
  /**
   * ✅ Register Themes config
   * 
   * Uses typed configuration (not inline object).
   * Preserves IntelliSense for theme properties.
   */
  constructor(configRegistryService: ConfigRegistryService) {
    configRegistryService.register('themes', themesConfiguration);
  }
}
