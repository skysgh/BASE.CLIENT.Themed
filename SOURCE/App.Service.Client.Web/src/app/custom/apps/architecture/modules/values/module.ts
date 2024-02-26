// Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Common dependencies:

// Module specific
import { SpikesSpikeRoutingModule } from "./routing.module";
import {ArchitectureValuesRepositoryService } from "./../../services/values-repository.service"
import { ArchitectureValuesBrowseComponent } from "./ui/browse/component";
import { ArchitectureValuesBrowseItemComponent } from "./ui/browse/item/component";
import { ArchitectureValuesReadComponent} from "./ui/read/component";
import { ArchitectureValuesEditComponent } from "./ui/edit/component";


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
    ArchitectureValuesBrowseComponent,
    ArchitectureValuesBrowseItemComponent,
    ArchitectureValuesReadComponent,
    ArchitectureValuesEditComponent
  ],
  providers: [
    // declare services to dependency inject into constructors.
    ArchitectureValuesRepositoryService
  ]
})
export class ArchitectureValuesModule { }
