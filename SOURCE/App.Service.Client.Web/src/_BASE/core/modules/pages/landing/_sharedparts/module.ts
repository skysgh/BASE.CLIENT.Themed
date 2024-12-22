// Rx:
//
// Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// Etc:
import { TranslateModule } from '@ngx-translate/core';
//import { JsonFormsModule } from '@jsonforms/angular';
//import { JsonFormsAngularMaterialModule } from '@jsonforms/angular-material';//Import template:
// Constants:
import { system as importedSystemConst } from '../../../../constants/system';

// Etc:

//import { BaseCoreCommonComponentsBreadcrumbsComponent } from '../../modules/components/breadcrumbs/component';

// Import  Base.Common.Models:
import { BaseAppsPagesLandingIndexDemosComponent } from './components/intro/component';
import { BaseAppsPagesLandingIndexClientsComponent } from './components/clients/component';
import { BaseAppsPagesLandingIndexFeaturesComponent } from './components/features/component';
import { BaseAppsPagesLandingIndexContactComponent } from './components/contact/component';
import { BaseAppsPagesLandingIndexStatsComponent } from './components/stats/component';
import { BaseAppsPagesLandingIndexCtaComponent } from './components/cta/component';
import { BaseAppsPagesLandingIndexDesignedComponent } from './components/designed/component';
import { BaseAppsPagesLandingIndexFaqsComponent } from './components/faqs/component';
import { BaseAppsPagesLandingIndexPlanComponent } from './components/plan/component';
import { BaseAppsPagesLandingIndexReviewComponent } from './components/endorsements/component';
import { BaseAppsPagesLandingIndexCapabilitiesComponent } from './components/capabilities/component';
import { BaseAppsPagesLandingIndexTeamComponent } from './components/team/component';
import { BaseAppsPagesLandingIndexWorkProcessComponent } from './components/process/component';

import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SharedModule } from '../../../../../../app/shared/module';
import { SystemDiagnosticsTraceService } from '../../../../services/system.diagnostics-trace.service';
import { NgbAccordionModule, NgbCarouselModule, NgbCollapseModule, NgbDropdownModule, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CountUpModule } from 'ngx-countup';
import { BaseCoreCommonModule } from '../../../common/module';
import { LandingScrollspyDirective } from '../../../common/landingscrollspy.directive';
import { ScrollspyDirective } from '../../../common/scrollspy.directive';
import { BaseCoreCommonComponentsModule } from '../../../common/components/module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { BaseAppsPagesLandingIndexHeaderComponent } from './components/header/component';
import { BaseAppsPagesLandingIndexScrollBackToTopComponent } from './components/scrollBackToTop/component';
//NO: import { ScrollspyDirective } from '../../common/scrollspy.directive';
//import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
// Module:


@NgModule({
  imports: [
    TranslateModule.forChild(),
    // Import classes within the above specified import files.
    //Ag specific:
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule,
    BaseCoreCommonModule,
    // Module specific:
    //ScrollToModule,
    //SlickCarouselModule,
    //NgbNavModule,
    NgbCarouselModule,
    NgbAccordionModule,
    //NgbDropdownModule,
    //CountUpModule,
    BaseCoreCommonComponentsModule,
    NgbTooltipModule,
    NgbCollapseModule,
    SlickCarouselModule,
    CountUpModule,
    //WidgetLibraryModule // Include WidgetLibraryModule here
  //  LandingScrollspyDirective,
    //  ScrollspyDirective
  ScrollToModule.forRoot()
  ],
  exports: [
    BaseAppsPagesLandingIndexHeaderComponent,
    BaseAppsPagesLandingIndexDemosComponent,
    BaseAppsPagesLandingIndexClientsComponent,
    BaseAppsPagesLandingIndexCapabilitiesComponent,
    BaseAppsPagesLandingIndexFeaturesComponent,
    BaseAppsPagesLandingIndexDesignedComponent,
    BaseAppsPagesLandingIndexCtaComponent,
    BaseAppsPagesLandingIndexDesignedComponent,
    BaseAppsPagesLandingIndexPlanComponent,
    BaseAppsPagesLandingIndexFaqsComponent,
    BaseAppsPagesLandingIndexReviewComponent,
    BaseAppsPagesLandingIndexStatsComponent,
    BaseAppsPagesLandingIndexWorkProcessComponent,
    BaseAppsPagesLandingIndexTeamComponent,
    BaseAppsPagesLandingIndexContactComponent,
    BaseAppsPagesLandingIndexScrollBackToTopComponent
  ],
  declarations: [
    BaseAppsPagesLandingIndexHeaderComponent,
    BaseAppsPagesLandingIndexDemosComponent,
    BaseAppsPagesLandingIndexClientsComponent,
    BaseAppsPagesLandingIndexCapabilitiesComponent,
    BaseAppsPagesLandingIndexFeaturesComponent,
    BaseAppsPagesLandingIndexDesignedComponent,
    BaseAppsPagesLandingIndexCtaComponent,
    BaseAppsPagesLandingIndexDesignedComponent,
    BaseAppsPagesLandingIndexPlanComponent,
    BaseAppsPagesLandingIndexFaqsComponent,
    BaseAppsPagesLandingIndexReviewComponent,
    BaseAppsPagesLandingIndexStatsComponent,
    BaseAppsPagesLandingIndexWorkProcessComponent,
    BaseAppsPagesLandingIndexTeamComponent,
    BaseAppsPagesLandingIndexContactComponent,
    BaseAppsPagesLandingIndexScrollBackToTopComponent,
  ],
  providers: [
    // declare services to dependency inject into constructors.
  ]
})
export class BaseCoreLandingSharedPartsModule {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`);
  }
}
