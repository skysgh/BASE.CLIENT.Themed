import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
// Parent Module:
//import { BaseThemesV1Module } from "../themes/t1/module";
//import { BaseCoreSitesFeaturesModule } from "./features/module";
import { BaseThemesModule } from "../themes/module";
import { appsConfiguration } from "../apps/configuration/implementations/apps.configuration";
import { sitesConfiguration } from "./configuration/implementation/sites.configuration";
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
export class BaseCoreSitesModule {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

}
