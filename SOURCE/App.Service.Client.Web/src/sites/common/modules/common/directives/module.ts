// Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingScrollspyDirective } from './landingscrollspy.directive';
import { ScrollspyDirective } from './scrollspy.directive';
// Misc:

// Pipes:

// Services:
// import { TranslateService } from '@ngx-translate/core';


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
    ScrollspyDirective,
    LandingScrollspyDirective,
  ],
  providers: [
  ],
  exports: [
    LandingScrollspyDirective,
    ScrollspyDirective
  ]
})
export class BaseCoreCommonDirectivesModule { }
