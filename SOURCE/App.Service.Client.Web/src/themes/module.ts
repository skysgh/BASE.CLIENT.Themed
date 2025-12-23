// Nx
//
// Ag:
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
// Const:

// Services:

// Parent Modules:
import { BaseCoreAgModule } from "../core.ag/module";
// Modules:
import { BaseThemesV1Module } from "./t1/module";


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
export class BaseThemesModule { }
