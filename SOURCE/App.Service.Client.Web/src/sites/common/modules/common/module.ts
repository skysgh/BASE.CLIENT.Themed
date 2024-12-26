// Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Misc:
import { NgbAccordionModule, NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { TranslateModule } from '@ngx-translate/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';

// no import { ScrollspyDirective } from './directives/scrollspy.directive';
//no import { LandingScrollspyDirective } from './directives/landingscrollspy.directive';

// Services:
import { SystemEndorsementRepositoryService } from '../../../../core/services/services/repositories/service-endorsements.repository.service';
import { matchesProperty } from 'lodash';

// Import child Modules:
import { BaseCoreUIModule } from '../../../../core.ui/module';

import { BaseCoreCommonDirectivesModule } from './directives/module';
import { BaseCoreCommonPipesModule } from './pipes/module';
import { BaseCoreCommonComponentsModule } from './components/module';

//import { EnabledPipe } from './pipes/enabled.pipe';
//import { MatchesPipe } from './pipes/matches.pipe';

//import { BaseTranslatePipe } from './pipes/basetranslate.pipe';
//import { ScrollspyDirective } from './scrollspy.directive';

//import Module specific:
@NgModule({
  imports: [
    // Import classes within the above specified import files.
    // Ag specific:
    CommonModule,

    TranslateModule.forChild(),

    BaseCoreUIModule,

    BaseCoreCommonDirectivesModule,
    BaseCoreCommonPipesModule,
    BaseCoreCommonComponentsModule,
    // Module specific:
    // No components
    NgbNavModule,
    NgbAccordionModule,
    NgbDropdownModule,
    SlickCarouselModule

  ],

  declarations: [
  ],
  providers: [
    SystemEndorsementRepositoryService,
  ],
  exports: [
    BaseCoreUIModule,

    BaseCoreCommonDirectivesModule,
    BaseCoreCommonPipesModule,
    BaseCoreCommonComponentsModule,
  ]
})
export class BaseCoreCommonModule { }
