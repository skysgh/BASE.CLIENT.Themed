// Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemService } from '../../services/system.service';
import { EnvironmentService } from '../../services/environment.service';
import { TitleService } from '../../services/title.service';
import { SystemLanguagesRepositoryService } from '../../services/repositories/system.languages.repository.service';
import { ScrollspyDirective } from './scrollspy.directive';
import { LandingScrollspyDirective } from './landingscrollspy.directive';
import { NgbAccordionModule, NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { TranslateModule } from '@ngx-translate/core';
//import { ScrollspyDirective } from './scrollspy.directive';

//import Module specific:
@NgModule({
  imports: [
    // Import classes within the above specified import files.
    // Ag specific:
    CommonModule,
    TranslateModule.forChild(),
    // Module specific:
    // No components
    NgbNavModule,
    NgbAccordionModule,
    NgbDropdownModule,
    SlickCarouselModule,
  ],

  declarations: [
    ScrollspyDirective,
    LandingScrollspyDirective,
],
  providers: [

  ],
  "exports": [
    LandingScrollspyDirective,
    ScrollspyDirective
  ]
})
export class BaseCoreCommonModule { }
