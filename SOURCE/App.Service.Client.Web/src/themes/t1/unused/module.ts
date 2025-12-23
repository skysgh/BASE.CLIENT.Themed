// Ag dependencies:
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// NO: Parent Module:
// NO: import { BaseThemesV1Module } from "../module";
// Children:
import { BaseThemesV1UnusedDirectivesModule } from "./directives/module";
import { BaseThemesV1UnusedComponentsModule } from "./components/module";
import { BaseThemesV1UnusedFeaturesModule } from "./features/module";
import { BaseThemesV1UnusedPipesModule } from "./pipes/module";


//import Module specific:
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
    // NO: Import Parent Module:
    // NO: BaseThemesV1Module,
    // N/A since unused.
    // Child Modules:
    BaseThemesV1UnusedDirectivesModule,
    BaseThemesV1UnusedComponentsModule,
    BaseThemesV1UnusedFeaturesModule,
    BaseThemesV1UnusedPipesModule
  ],
  exports: [
    // NO: Export Parent Module: (create's circular condition)
    // NO: BaseThemesV1Module,
    // Child Modules:
    BaseThemesV1UnusedDirectivesModule,
    BaseThemesV1UnusedComponentsModule,
    BaseThemesV1UnusedFeaturesModule,
    BaseThemesV1UnusedPipesModule
  ]
})
export class BaseThemesV1UnusedModule { }
