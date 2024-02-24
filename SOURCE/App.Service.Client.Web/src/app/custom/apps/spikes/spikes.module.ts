// Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Other dependencies:

//Module specific:
import { SpikesRoutingModule } from "./spikes-routing.module";
//Module specific components:
import { SpikesReadComponent} from "./ui/read/spikes-read.component";
import { SpikesEditComponent } from "./ui/edit/spikes-edit.component";


@NgModule({
  imports: [
    // Import classes within the above specified import files.
    //Ag specific:
    CommonModule,
    FormsModule,
    // Module specific:
    SpikesRoutingModule
    // No components
  ],
  
  declarations: [
    // define what Components belong to this Module (i.e., are not `standalone`)
    SpikesReadComponent,
    SpikesEditComponents
  ],
  providers: [
    // declare services to dependency inject into constructors.
  ]
})
export class SpikesModule { }
