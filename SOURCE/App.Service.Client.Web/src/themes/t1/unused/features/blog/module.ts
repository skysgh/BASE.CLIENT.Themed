// Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Can Remove: import { TranslateModule } from '@ngx-translate/core';
//
import { NgbNavModule, NgbAccordionModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
// Misc:
// ...Swiper Slider
import { RouterModule } from '@angular/router';
// ...Counter
import { CountUpModule } from 'ngx-countup';
//
import { SlickCarouselModule } from 'ngx-slick-carousel';

// Components
import { BlogComponent } from './blog.component';
import { BaseCoreAgModule } from '../../../../../core.ag/module';
// NO: Parent Module:
// NO: import { BaseThemesV1UnusedFeaturesModule } from '../module';

@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    BlogComponent
  ],
  providers: [],

  imports: [
    // Ag:
    CommonModule,
    //
    NgbNavModule,
    NgbAccordionModule,
    NgbDropdownModule,
    CountUpModule,
    RouterModule,
    BaseCoreAgModule,
    //Can Remove: TranslateModule.forChild(),
    SlickCarouselModule,
    // NO: Import Parent Modules:
    // NO: BaseThemesV1UnusedFeaturesModule
  ],
  exports: [
    // NO: Export Parent Modules:
    // NO: BaseThemesV1UnusedFeaturesModule,
    // Declared Components:
    BlogComponent
  ]
})
//Was SharedModule
export class BaseThemesV1UnusedFeaturesBlogModule { }
