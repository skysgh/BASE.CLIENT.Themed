// Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Other dependencies:

//Module specific:
import { ArchitectureRoutingModule } from "./routing.module";
import {ArchitectureValuesRepositoryService } from "./services/values-repository.service"
//Module specific components:
import { ArchitectureValuesModule } from "./modules/values/module";

@NgModule({
  imports: [
    // Import classes within the above specified import files.
    //Ag specific:
    CommonModule,
    FormsModule,
    // Module specific:
    ArchitectureRoutingModule,
    // SubModules:
    //ArchitectureValuesModule
    // No components
  ],
  
  declarations: [
  ],
  providers: [
    // declare services to dependency inject into constructors.
    ArchitectureValuesRepositoryService
  ]
})
export class ArchitectureModule { }
