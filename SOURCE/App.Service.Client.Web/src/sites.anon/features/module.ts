import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BaseCoreSitesModule } from "../module";
import { BaseThemesModule } from "../../themes/module";
import { sitesConfiguration } from "../configuration/implementation/sites.configuration";

// Parent Module:
//NO: import { BaseCoreSitesModule } from "../module";
// Child Modules:
// NO: import { BaseCorePagesModule } from "./pages/module";
// NO: import { BaseCoreDashboardsModule } from "./dashboard/module";


@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
  ],
  providers: [
  ],
  imports: [
    // Import classes within the above specified import files.
    // Ag specific:
    CommonModule,

    // Import Base of Upstream Column: Themes, and thereby Core.Ag: 
    BaseThemesModule,


    // Dependencies:
    //
    // NO: Import Parent Module:
    // NO: BaseCoreSitesModule,
    // NO: Import Child Modules: (do NOT, as otherwise you'll import what should be lazy loaded...)
    // NO: BaseCoreDashboardsModule,
    // NO: BaseCorePagesModule
  ],
  exports: [
    // NO: Export Parent Module:
    // NO: BaseThemesV1Module
  ]

})
/**
 * Base Sites Features Module
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
export class BaseCoreSitesFeaturesModule {
  // ❌ REMOVED: public appsConfiguration = appsConfiguration
  // Components should use ConfigRegistryService instead
  
  // ✅ KEEP: Expose parent configuration (Sites owns this)
  public groupConfiguration = sitesConfiguration
}
