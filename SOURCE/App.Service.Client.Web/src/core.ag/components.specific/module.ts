// Ag:
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
// Components:
import { BaseCoreCommonComponentsGoogleAnalyticsComponent } from "./google-analytics/component";
import { BaseCoreCommonComponentsGoogleMapsComponent } from "./google-maps/component";
import { BaseCoreCommonComponentsPdfComponent } from "./pdf/component";

// NO: Parent Module:
// NO: import { BaseCoreAgModule } from "../module";

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { BaseCoreAgModule } from "../module";
// ❌ REMOVED: No longer import appsConfiguration (breaks circular dependency)
import { coreAgConfiguration } from "../configuration/implementations/coreAg.configuration";


/**
 * Module of Components that are unstyled/generic html
 * and not common to most views.
 *
 * Example would include maps, or PDF renderers,
 * which are sufficiently heavy that it would
 * be defer loading till when actually needed.
 * 
 * ✅ DECOUPLED: No longer imports appsConfiguration
 * Components should use ConfigRegistryService if needed.
 */
@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    BaseCoreCommonComponentsGoogleAnalyticsComponent,
    BaseCoreCommonComponentsGoogleMapsComponent,
    BaseCoreCommonComponentsPdfComponent
  ],
  providers: [
    // declare services to dependency inject into constructors.
  ],
  imports: [
    CommonModule,

    // Go sideways:
    BaseCoreAgModule,
    // Supporting:
    PdfViewerModule,
    // NO: Import Parent Module:
    // NO: BaseCoreAgModule,


  ],
  exports: [
    // NO: Export Parent Module:
    // NO: BaseCoreAgSupportModule,
    // Components:
    BaseCoreCommonComponentsGoogleAnalyticsComponent,
    BaseCoreCommonComponentsGoogleMapsComponent,
    BaseCoreCommonComponentsPdfComponent,
    // Modules
    BaseCoreAgModule
  ]
})

/**
 *
 * This module is problematic in that it is groups
 * components that are heavy and not gauranteed to be used.
 *
 * So this module probably should never be imported,
 * and the components should be imported individually
 * (they may be even marked as standalone).
 */
export class BaseCoreAgComponentsSpecificModule {
  // ❌ REMOVED: public appsConfiguration = appsConfiguration
  // Components should use ConfigRegistryService instead
  
  // ✅ KEEP: Expose parent configuration (Core.Ag owns this)
  public groupConfiguration = coreAgConfiguration
}
