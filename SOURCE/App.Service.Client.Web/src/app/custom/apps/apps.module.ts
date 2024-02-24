// Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Other dependencies:

// Module specific:
import { AppsRoutingModule } from "./apps-routing.module";
// Module specific components:
import { AppsRouteComponent } from "./ui/route/apps-route.component";


@NgModule({
  imports: [
    // Import classes within the above specified import files.
    // Ag specific:
    CommonModule,
    FormsModule,
    // Module specific:
    AppsRoutingModule
    // No components
  ],

  declarations: [
    // define what Components belong to this Module (i.e., are not `standalone`)
    AppsRouteComponent
  ],
  providers: [
    // declare services to dependency inject into constructors.
  ]
})
export class AppsModule { }
