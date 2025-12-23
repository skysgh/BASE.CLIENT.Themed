// Ag dependencies:
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BaseCoreAgPipesModule } from "../../../core.ag/pipes/module";

// NO: Parent Module:
// NO: import { BaseThemesV1Module } from "../module";

//import Module specific:
@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    // Pipes:
    // ...not yet...
  ],
  providers: [
    // N/A
  ],
  imports: [
    // Import classes within the above specified import files.
    // Ag specific:
    CommonModule,

    BaseCoreAgPipesModule
    // NO: Import Parent Module:
    // NO: BaseThemesV1Module
    // Child Modules:
    // N/A
  ],
  exports: [
    BaseCoreAgPipesModule
    // NO: Export Parent Module: (create's circular condition)
    // NO: BaseThemesV1Module
    // Pipes (make sure to export any defined):
  ]
})
export class BaseThemesV1PipesModule { }
