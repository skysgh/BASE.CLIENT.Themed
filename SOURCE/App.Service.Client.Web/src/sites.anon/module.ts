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
    // Sites.Anon tier provides its own tokens for its components to inject.
    // Values come from sitesConstants (own tier).
    // ============================================================================
    
    {
      provide: DEPLOYED_RESOURCES,
      useValue: {
        logos: {
          // ✅ Use bracket notation for properties from index signature
          light: sitesConstants.assets['deployed'].images.logos + 'logo-light.png',
          dark: sitesConstants.assets['deployed'].images.logos + 'logo-dark.png'
        },
        images: {
          root: sitesConstants.assets['deployed'].images.root,
          trustedBy: sitesConstants.assets['deployed'].images.trustedBy,
          flags: sitesConstants.assets['deployed'].images.flags,
          backgrounds: sitesConstants.assets['deployed'].images.backgrounds
        },
        files: {
          root: sitesConstants.assets['deployed'].files.root,
          markdown: sitesConstants.assets['deployed'].files.markdownDir || sitesConstants.assets['deployed'].files.root + 'markdown/',
          pdf: sitesConstants.assets['deployed'].files.pdfDir || sitesConstants.assets['deployed'].files.root + 'pdf/'
        }
      }
    }
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
