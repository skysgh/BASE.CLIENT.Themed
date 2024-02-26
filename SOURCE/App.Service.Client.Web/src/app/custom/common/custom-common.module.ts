// Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    // define what Services
  ],
  providers: [
    // declare services to dependency inject into constructors.
  ]
})
export class CustomCommonModule { }
