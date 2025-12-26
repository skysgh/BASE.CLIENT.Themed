import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BaseAppsModule } from "../module";

@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    // ...not yet...
  ],
  providers: [
    // declare services to dependency inject into constructors.
    // ...not yet...
  ],
  imports: [
    // Import classes within the above specified import files.
    //Ag specific:
    CommonModule,
    // Routes:
    // ...BaseAppsTemplateRoutingModule,

    // SubModules:
    // ...not yet...
    // Components
    // ...not yet...
    // Import Parent Module:
    BaseAppsModule
  ],
  exports: [
    // NO: Export Parent Module: (create's circular condition)
    // NO: BaseAppsModule
  ],
})
export class BaseAppsTemplateModule { }
