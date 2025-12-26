import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

// ✅ Config Registry
import { ConfigRegistryService } from "../core/services/config-registry.service";

// ✅ Import DI tokens
import { DEPLOYED_RESOURCES } from "./tokens/deployed-resource.tokens";

// Parent Module:
import { BaseThemesModule } from "../themes/module";
import { sitesConfiguration } from "./configuration/implementation/sites.configuration";

// ✅ Import sites constants for registration and token values
import { sitesConstants } from "./constants/implementations/sites.constants";


@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
  ],
  providers: [
    // ============================================================================
    // ✅ DI TOKEN PROVIDERS
    // 
    // NOTE: DEPLOYED_RESOURCES now uses providedIn: 'root' in its token definition
    // so it's automatically available everywhere. No explicit provider needed here.
    // 
    // If you need to override default values, provide it here:
    // {
    //   provide: DEPLOYED_RESOURCES,
    //   useValue: { /* custom values */ }
    // }
    // ============================================================================
  ],
  imports: [
    CommonModule,
    BaseThemesModule,
  ],
  exports: [
    BaseThemesModule,
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
