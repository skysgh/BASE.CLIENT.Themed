// Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingScrollspyDirective } from './landingscrollspy.directive';
import { ScrollspyDirective } from './scrollspy.directive';
import { BaseCoreAgDirectivesModule } from '../../../core.ag/directives/module';

// NO: Parent Module:
// NO: import { BaseThemesV1Module } from '../module';
// Misc:

// Pipes:

// Services:
// import { TranslateService } from '@ngx-translate/core';


//import Module specific:
@NgModule({
  declarations: [
    // Directives (make sure to export any defined):
    ScrollspyDirective,
    LandingScrollspyDirective
  ],
  providers: [
    // N/A

  ],
  imports: [
    // Import classes within the above specified import files.
    // Ag specific:
    CommonModule,
    // NO: Import Parent Module:
    // NO: BaseThemesV1Module
    BaseCoreAgDirectivesModule
  ],
  exports: [
    BaseCoreAgDirectivesModule,


    // NO: Export Parent Module: (create's circular condition)
    // NO: BaseThemesV1Module
    // Declarations:
    LandingScrollspyDirective,
    ScrollspyDirective
    
  ]
})
export class BaseThemesV1DirectivesModule { }
