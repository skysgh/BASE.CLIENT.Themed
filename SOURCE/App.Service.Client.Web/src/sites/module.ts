import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

// ✅ Config Registry
import { ConfigRegistryService } from "../core/services/config-registry.service";

// Parent Module:
import { BaseThemesModule } from "../themes/module";
import { sitesConfiguration } from "./configuration/implementation/sites.configuration";

// ✅ Import sites constants for registration
import { sitesConstants } from "./constants/implementations/sites.constants";

// Child Modules:
// NO: import { BaseCorePagesModule } from "./pages/module";
// NO: import { BaseCoreDashboardsModule } from "./dashboard/module";


@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
  ],
  providers: [
    // declare services to dependency inject into constructors.
  ],
  imports: [
    // Import classes within the above specified import files.
    // Ag specific:
    CommonModule,
    // Import Base of Upstream Column: Themes, and thereby Core.Ag: 
    BaseThemesModule,

    // NO: Import Parent Module:
    // NO: N/A (at top of column hiearchy)
    // NO: Import Child Modules:
    // NO: BaseCoreSitesFeaturesModule,
    // NO: BaseCoreDashboardsModule,
    // NO: BaseCorePagesModule
  ],
  exports: [
    BaseThemesModule,
    // NO: Export Parent Module:
    // NO: BaseThemesV1Module
    // Child Modules:
    // NO: BaseCoreSitesFeaturesModule
  ]

})
/**
 * Base Sites Module
 * 
 * ✅ DECOUPLED: No longer imports appsConfiguration
 * 
 * Breaking change: Removed public appsConfiguration property.
 * Components should use ConfigRegistryService instead.
 * 
 * Benefits:
 * ✅ No circular dependency (Sites no longer imports Apps)
 * ✅ Proper tier architecture
 * ✅ Modules are not config providers
 */
export class BaseCoreSitesModule {
  // ❌ REMOVED: public appsConfiguration = appsConfiguration
  // Components should use ConfigRegistryService instead
  
  // ✅ KEEP: Expose parent configuration (Sites owns this)
  public groupConfiguration = sitesConfiguration

  /**
   * ✅ Register Sites config
   * 
   * Registers sites configuration including:
   * - Navigation paths
   * - API endpoints
   * - Resource paths (deployed/uploaded)
   * - Assets
   */
  constructor(configRegistryService: ConfigRegistryService) {
    configRegistryService.register('sites', {
      constants: sitesConstants,
      configuration: sitesConfiguration
    });
  }
}
