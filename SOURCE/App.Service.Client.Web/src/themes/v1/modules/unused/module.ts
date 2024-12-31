// Ag dependencies:
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "./unsure/shared/module";

//import Module specific:
@NgModule({
  imports: [
    // Import classes within the above specified import files.
    // Ag specific:
    CommonModule,
    //
    SharedModule
  ],
  declarations: [

  ],
  providers: [
  ],
  exports: [
    SharedModule
  ]
})
export class BaseThemesV1UnusedModule { }
