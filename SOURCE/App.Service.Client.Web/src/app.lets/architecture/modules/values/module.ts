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
import { BaseAppsModule } from '../../../module';

@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    BaseAppsArchitectureValuesBrowseComponent,
    ArchitectureValuesBrowseItemComponent,
    BaseAppsArchitectureValuesReadComponent,
    BaseAppsArchitectureValuesEditComponent
  ],
  providers: [
    // declare services to dependency inject into constructors.
    ArchitectureValuesRepositoryService
  ],
  imports: [
    // Import classes within the above specified import files.
    //Ag specific:
    CommonModule,
    FormsModule,
    // Import Parent Module:
    BaseAppsModule,
    // Child Modules:
    //SpikeSpikesRoutingModule
    // No components
  ],
  exports: [
    // NO: Export Parent Module
    // NO: BaseAppsModule
  ]
  
})
export class BaseAppsArchitectureValuesModule { }
