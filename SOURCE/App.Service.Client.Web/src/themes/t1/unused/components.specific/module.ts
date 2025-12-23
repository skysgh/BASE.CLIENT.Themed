// Ag dependencies:
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
// NO: Parent Module:
// NO: import { BaseThemesV1UnusedModule } from "../module";


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
    // NO: BaseThemesV1UnusedModule
    // N/A since unused.
    // Child Modules:
    // WARNING:
    // Do *not* import all Child Component Modules
    // or a child module that imports its Parent will
    // pull in all other specific childen.
    // ie: it defeats the purpose of
    // NOT pulling in every heavy component+lib.
    // when only one is needed.
  ],
  exports: [
    // NO: Export Parent Module:
    // NO: BaseThemesV1UnusedModule
  ]
})
export class BaseThemesV1UnusedComponentsSpecificModule { }
