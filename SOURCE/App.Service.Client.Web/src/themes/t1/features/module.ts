// Ag:
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BaseCoreAgPipesModule } from "../../../core.ag/pipes/module";
// NO: Parent Module:
// NO: import { BaseThemesV1Module } from "../module";
// Chld Modules:
// NO!

//import Module specific:
@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    // ..not yet...
  ],
  providers: [
    // ...not yet...
  ],
  imports: [
    // Import classes within the above specified import files.
    // Ag specific:
    CommonModule,
    BaseCoreAgPipesModule,
    // NO: Import Parent Module:
    // NO: BaseThemesV1Module
    // Child Modules:
    // WARNING:
    // Do not import Child Feature Modules, or
    // it will import them all, even if later we think we are
    // are laxy loading.
  ],
  exports: [
    // NO: Export Parent Module: (create's circular condition)
    // NO: BaseThemesV1Module,
    // Child Modules:
    // WARNING:
    // Do not export Child Feature Modules, or
    // it will import them all, even if later we think we are
    // are laxy loading.
  ]
})
export class BaseThemesV1FeaturesModule { }
