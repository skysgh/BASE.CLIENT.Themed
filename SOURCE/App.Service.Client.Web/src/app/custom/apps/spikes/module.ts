// Import Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import Common dependencies:

// Import Module specific dependencies:
import { SpikesRoutingModule } from "./routing.module";
// .. services:
import { SpikeSpikesRepositoryService } from "./services/spike-repository.service"
// ..components:
import { SpikesRouteComponent } from './ui/_route/component';
// ...submodules:
// NO mention, as it is late loaded by routes:
// import { SpikesSpikeModule } from "./modules/spike/module";

@NgModule({
  imports: [
    // Import classes within the above specified import files.
    //Ag specific:
    CommonModule,
    FormsModule,
    // Module specific:
    SpikesRoutingModule,
  ],
  
  declarations: [
    // define what Components belong to this Module (i.e., are not `standalone`)
    SpikesRouteComponent
  ],
  providers: [
    // declare services to dependency inject into constructors.
    SpikeSpikesRepositoryService
  ]
})
export class SpikesModule { }
