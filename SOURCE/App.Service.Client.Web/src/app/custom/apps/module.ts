// NOTE:
// REferenced from src/app-routing.module.ts
// which lazy loads it with `LayoutComponent`
// which essnetially is router-outlet embedded
// in a vertical/horizontal/other layout.


// Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Other dependencies:
import { CustomCommonModule } from "../common/custom-common.module";

// Module specific:
import { CustomAppsRoutingModule } from "./routing.module";
import { CustomAppsRouteComponent } from "./ui/_route/component";


@NgModule({
  imports: [
    // Import classes within the above specified import files.
    // Ag specific:
    CommonModule,
    FormsModule,
    // Custom specific:
    CustomCommonModule,
    // Module specific:
    CustomAppsRoutingModule
    // No components
  ],

  declarations: [
    // define what Components belong to this Module (i.e., are not `standalone`)
    CustomAppsRouteComponent
  ],
  providers: [
    // declare services to dependency inject into constructors.
  ]
})
export class CustomAppsModule { }


