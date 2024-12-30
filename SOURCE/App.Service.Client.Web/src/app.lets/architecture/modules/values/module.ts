// Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Common dependencies:

// Module specific
//import { SpikeSpikesRoutingModule } from "./routing.module";
import { BaseAppsArchitectureValuesBrowseComponent } from "./ui/browse/component";
import { ArchitectureValuesBrowseItemComponent } from "./ui/browse/item/component";
import { BaseAppsArchitectureValuesReadComponent } from "./ui/read/component";
import { BaseAppsArchitectureValuesEditComponent } from "./ui/edit/component";

import { ArchitectureValuesRepositoryService } from '../../services/repositories/values-repository.service';

@NgModule({
  imports: [
    // Import classes within the above specified import files.
    //Ag specific:
    CommonModule,
    FormsModule,
    // Module specific:
    //SpikeSpikesRoutingModule
    // No components
  ],
  
  declarations: [
    // define what Components belong to this Module (i.e., are not `standalone`)
    BaseAppsArchitectureValuesBrowseComponent,
    ArchitectureValuesBrowseItemComponent,
    BaseAppsArchitectureValuesReadComponent,
    BaseAppsArchitectureValuesEditComponent
  ],
  providers: [
    // declare services to dependency inject into constructors.
    ArchitectureValuesRepositoryService
  ]
})
export class BaseAppsArchitectureValuesModule { }
