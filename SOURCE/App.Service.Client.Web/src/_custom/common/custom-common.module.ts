// Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemService } from './services/system.service';
import { EnvironmentService } from './services/environment.service';
import { TitleService } from './services/title.service';

//import Module specific:
@NgModule({
  imports: [
    // Import classes within the above specified import files.
    // Ag specific:
    CommonModule,
    // Module specific:
    // No components
  ],

  declarations: [
  ],
  providers: [
    // declare services to dependency inject into constructors.
    // define what Services
    SystemService,
    EnvironmentService,
    TitleService
  ]
})
export class CustomCommonModule { }
