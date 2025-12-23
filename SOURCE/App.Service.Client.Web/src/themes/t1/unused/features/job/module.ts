// Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
//Can Remove: import { TranslateModule } from '@ngx-translate/core';

import { NgbNavModule, NgbAccordionModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { SlickCarouselModule } from 'ngx-slick-carousel';
// Swiper Slider
// Counter
import { CountUpModule } from 'ngx-countup';

//import { BaseCoreCommonComponentsBreadcrumbsComponent } from '../../core/modules/components/breadcrumbs/component';



// Job Landing 
import { CandidateComponent } from './candidate/component';
import { FindjobsComponent } from './findjobs/findjobs.component';
import { JobBaseLayoutFooterComponent } from './job-footer/job-footer.component';
import { JobcategoriesComponent } from './jobcategories/jobcategories.component';
import { ProgressComponent } from './progress/progress.component';
import { BaseCoreAgModule } from '../../../../../core.ag/module';
// NO: Parent Module:
// NO: import { BaseThemesV1UnusedFeaturesModule } from '../module';

@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    //BaseCoreCommonComponentsBreadcrumbsComponent,`
    CandidateComponent,
    FindjobsComponent,
    JobBaseLayoutFooterComponent,
    JobcategoriesComponent,
    ProgressComponent
  ],
  providers: [],
  imports: [
    // Ag:
    CommonModule,
    RouterModule,
    //Misc:
    NgbNavModule,
    NgbAccordionModule,
    NgbDropdownModule,
    // Misc:
    CountUpModule,
    //Can Remove: TranslateModule.forChild(),
    SlickCarouselModule,
    // NO: Import Parent Module:
    // NO: BaseThemesV1UnusedFeaturesModule
    BaseCoreAgModule
  ],
  exports: [
    // NO: Export Parent Module: (create's circular condition)
    // NO: BaseThemesV1UnusedFeaturesModule,
    // Declared Components:
    ProgressComponent,
    FindjobsComponent,
    CandidateComponent,
    JobcategoriesComponent,
    JobBaseLayoutFooterComponent
  ]
})
//Was SharedModule
export class BaseThemesV1UnusedFeaturesJobsModule { }
