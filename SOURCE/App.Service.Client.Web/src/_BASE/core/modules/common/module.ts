// Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Etc:
import { TranslateService } from '@ngx-translate/core';

import { ScrollspyDirective } from './scrollspy.directive';
import { LandingScrollspyDirective } from './landingscrollspy.directive';
import { NgbAccordionModule, NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { TranslateModule } from '@ngx-translate/core';
import { SystemEndorsementRepositoryService } from '../../services/services/repositories/service-endorsements.repository.service';
import { matchesProperty } from 'lodash';
import { EnabledPipe } from './pipes/enabled.pipe';
import { MatchesPipe } from './pipes/matches.pipe';

import { BaseTranslatePipe } from './pipes/basetranslate.pipe';
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
    SlickCarouselModule
  ],

  declarations: [
    ScrollspyDirective,
    LandingScrollspyDirective,
    
    BaseTranslatePipe,

    EnabledPipe,
    MatchesPipe
],
  providers: [
    SystemEndorsementRepositoryService,
  ],
  exports: [
    LandingScrollspyDirective,
    ScrollspyDirective,

    BaseTranslatePipe,
    EnabledPipe,
    MatchesPipe

  ]
})
export class BaseCoreCommonModule { }
