import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule, NgbAccordionModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';


// Swiper Slider
import { RouterModule } from '@angular/router';
// Counter
import { CountUpModule } from 'ngx-countup';

//import { BaseCoreCommonComponentsBreadcrumbsComponent } from '../../_BASE/core/modules/components/breadcrumbs/component';



// Job Landing 
import { BlogComponent } from './landing/job/blog/blog.component';
import { CandidateComponent } from './landing/job/candidate/component';
import { FindjobsComponent } from './landing/job/findjobs/findjobs.component';
import { JobBaseLayoutFooterComponent } from './landing/job/job-footer/job-footer.component';
import { JobcategoriesComponent } from './landing/job/jobcategories/jobcategories.component';
import { ProgressComponent } from './landing/job/progress/progress.component';
import { TranslateModule } from '@ngx-translate/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { BaseCoreCommonModule } from '../../_BASE/core/modules/common/module';

@NgModule({
  declarations: [
    //BaseCoreCommonComponentsBreadcrumbsComponent,

    BlogComponent,
    CandidateComponent,
    FindjobsComponent,
    JobBaseLayoutFooterComponent,
    JobcategoriesComponent,
    ProgressComponent
  ],
  imports: [
    CommonModule,
    BaseCoreCommonModule,

    NgbNavModule,
    NgbAccordionModule,
    NgbDropdownModule,
    CountUpModule,
    RouterModule,
    TranslateModule.forChild(),
    SlickCarouselModule

  ],
  exports: [
    //BaseCoreCommonComponentsBreadcrumbsComponent,
    
    ProgressComponent,
    FindjobsComponent,
    CandidateComponent,
    BlogComponent,
    JobcategoriesComponent,
    JobBaseLayoutFooterComponent]
})
export class SharedModule { }
