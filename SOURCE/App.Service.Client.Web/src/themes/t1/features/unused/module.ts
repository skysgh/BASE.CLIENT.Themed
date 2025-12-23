// Ag:
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BaseThemesModule } from "../../../module";

// NO: Parent Module:
// NO: import { BaseThemesV1FeaturesModule } from "../module";

//import Module specific:
@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    // ...not yet...
  ],
  providers: [
  ],
  imports: [
    // Import classes within the above specified import files.
    // Ag specific:
    CommonModule,
    // Import upstream:
    BaseThemesModule,

    // NO: Import Parent Module:
    // NO: BaseThemesV1FeaturesModule
  ],
  exports: [
    // NO: Export Parent Module: (create's circular condition)
    // NO: BaseThemesV1FeaturesModule
    // ...not yet...
  ]
})


export class BaseThemesV1UnusedModule { }
