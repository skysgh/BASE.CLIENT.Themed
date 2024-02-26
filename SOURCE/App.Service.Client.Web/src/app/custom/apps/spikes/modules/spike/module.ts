// Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Common dependencies:

// App specific:
import { SpikesSpikeRoutingModule } from "./routing.module";
// Entity module specific:
// .. services:
import { SpikeSpikesRepositoryService } from "./../../services/spike-repository.service"
// .. components:
import { SpikesSpikeBrowseComponent } from "./ui/browse/component";
import { SpikesSpikeBrowseItemComponent } from "./ui/browse/item/component";
import { SpikesSpikeReadComponent} from "./ui/read/component";
import { SpikesSpikeEditComponent } from "./ui/edit/component";
import { DiagnosticsService } from '../../../../common/services/diagnostics.service';
import { SpikesSpikeRouteComponent } from './ui/_route/component';



@NgModule({
  imports: [
    // Import classes within the above specified import files.
    //Ag specific:
    CommonModule,
    FormsModule,
    // Module specific:
    SpikesSpikeRoutingModule
    // No components
  ],
  
  declarations: [
    // define what Components belong to this Module (i.e., are not `standalone`)
    SpikesSpikeRouteComponent,
    //
    SpikesSpikeBrowseComponent,
    SpikesSpikeBrowseItemComponent,
    SpikesSpikeReadComponent,
    SpikesSpikeEditComponent,
  ],
  providers: [
    // declare services to dependency inject into constructors.
    DiagnosticsService,
    SpikeSpikesRepositoryService
  ]
})

// Module for Spike Entity BREAD Views:
export class SpikesSpikeModule { }
