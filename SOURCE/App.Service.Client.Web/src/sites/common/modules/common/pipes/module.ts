// Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Misc:

// Pipes:

// Services:
import { TranslateService } from '@ngx-translate/core';


//import Module specific:
@NgModule({
  imports: [
    // Import classes within the above specified import files.
    // Ag specific:
    CommonModule,

    // Not sure if needed
    // TranslateModule.forChild(),

  ],

  declarations: [
  ],
  providers: [
  ],
  exports: [
    // make sure to export any defined pipes
  ]
})
export class BaseCoreCommonPipesModule { }
