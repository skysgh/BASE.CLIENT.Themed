// Import Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

//Import template:
//import { BaseCoreCommonComponentsBreadcrumbsComponent } from '../../modules/components/breadcrumbs/component';

import { BaseAppsPagesInformationIndexComponent } from './component';
// Import  Base.Common.Models:
import { BaseAppsPagesLandingIndexClientsComponent } from './components/clients/component';
import { BaseAppsPagesLandingIndexCollectionComponent } from './components/collection/component';
import { BaseAppsPagesLandingIndexContactComponent } from './components/contact/component';
import { BaseAppsPagesLandingIndexCounterComponent } from './components/counter/component';
import { BaseAppsPagesLandingIndexCtaComponent } from './components/cta/component';
import { BaseAppsPagesLandingIndexDesignedComponent } from './components/features/component';
import { BaseAppsPagesLandingIndexFaqsComponent } from './components/faqs/component';
import { BaseAppsPagesLandingIndexFooterComponent } from './components/footer/component';
import { BaseAppsPagesLandingIndexPlanComponent } from './components/plan/component';
import { BaseAppsPagesLandingIndexReviewComponent } from './components/review/component';
import { BaseAppsPagesLandingIndexCapabilitiesComponent } from './components/capabilities/component';
import { BaseAppsPagesLandingIndexTeamComponent } from './components/team/component';
import { BaseAppsPagesLandingIndexWorkProcessComponent } from './components/work-process/component';

import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SharedModule } from '../../../../../app/shared/module';
import { DiagnosticsTraceService } from '../../../services/diagnostics.service';
import { NgbAccordionModule, NgbCarouselModule, NgbCollapseModule, NgbDropdownModule, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CountUpModule } from 'ngx-countup';
import { BaseCoreCommonModule } from '../../common/module';
import { LandingScrollspyDirective } from '../../common/landingscrollspy.directive';
import { ScrollspyDirective } from '../../common/scrollspy.directive';
import { BaseCoreCommonComponentsModule } from '../../common/components/module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
//NO: import { ScrollspyDirective } from '../../common/scrollspy.directive';
//import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

@NgModule({
  imports: [
    TranslateModule.forChild(),
    RouterModule.forChild(
      [
        // We're basically saying that
        // parent module (base.module) associated 'page'
        // to a a routeroutlet containing component it managed,
        // and into it loaded this module.
        // This module then provided no further router-outlets, just pages
        // within its resposibility, such that
        // 'base/pages/' or 'base/pages/layout' loads a router-controller
        // it manages, and within that, loads deeper module.
        // Note:
        // Admittedly in he case of information, their simplicity doesn't
        // warant a module for each, but out of habit I *think* I prefer paying
        // a rigour price early, in case I manouverability later.
        { path: '', component: BaseAppsPagesInformationIndexComponent },
        { path: 'index', redirectTo: '', pathMatch: 'prefix' }
      ]
    ),
    // Import classes within the above specified import files.
    //Ag specific:
    CommonModule,
    FormsModule,
    SharedModule,
    // Module specific:
    //ScrollToModule,
    //SlickCarouselModule,
    //NgbNavModule,
    NgbCarouselModule,
    NgbAccordionModule,
    //NgbDropdownModule,
    //CountUpModule,
    BaseCoreCommonModule,
    BaseCoreCommonComponentsModule,
    NgbTooltipModule,
    NgbCollapseModule,
    SlickCarouselModule,
    CountUpModule,
  //  LandingScrollspyDirective,
    //  ScrollspyDirective
  ScrollToModule.forRoot()
  ],
  exports: [
    //NO:ScrollspyDirective,
    //NO?:SlickCarouselModule ,
    // Not sure why doing this:
    RouterModule,
    //
  //  BaseAppsPagesLandingIndexClientsComponent,
  //  BaseAppsPagesLandingIndexCollectionComponent,
  //  BaseAppsPagesLandingIndexContactComponent,
  //  BaseAppsPagesLandingIndexCounterComponent,
  //  BaseAppsPagesLandingIndexCtaComponent,
  //  BaseAppsPagesLandingIndexDesignedComponent,
  //  BaseAppsPagesLandingIndexFaqsComponent,
  //  BaseAppsPagesLandingIndexFooterComponent,
  //  BaseAppsPagesLandingIndexPlanComponent,
  //  BaseAppsPagesLandingIndexReviewComponent,
  //  BaseAppsPagesLandingIndexCapabilitiesComponent,
  //  BaseAppsPagesLandingIndexTeamComponent,
  //  BaseAppsPagesLandingIndexWorkProcessComponent
  ],
  declarations: [
    //NO: ScrollspyDirective,
    // define what Components belong to this Module (i.e., are not `standalone`)
    BaseAppsPagesInformationIndexComponent,

    BaseAppsPagesLandingIndexClientsComponent,
    BaseAppsPagesLandingIndexCapabilitiesComponent,
    BaseAppsPagesLandingIndexCollectionComponent,
    BaseAppsPagesLandingIndexCtaComponent,
    BaseAppsPagesLandingIndexDesignedComponent,
    BaseAppsPagesLandingIndexPlanComponent,
    BaseAppsPagesLandingIndexFaqsComponent,
    BaseAppsPagesLandingIndexFooterComponent,
    BaseAppsPagesLandingIndexReviewComponent,
    BaseAppsPagesLandingIndexCounterComponent,
    BaseAppsPagesLandingIndexWorkProcessComponent,
    BaseAppsPagesLandingIndexTeamComponent,
    BaseAppsPagesLandingIndexContactComponent,
  ],
  providers: [
    // declare services to dependency inject into constructors.
  ]
})
export class BaseCoreHomeModule {

  constructor(private diagnosticsTraceService: DiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`);
  }
}
