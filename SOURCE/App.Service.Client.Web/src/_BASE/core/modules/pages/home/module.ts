// Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// Etc:
import { TranslateModule } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../constants/system';

// Etc:
//import { JsonFormsModule } from '@jsonforms/angular';
//import { JsonFormsAngularMaterialModule } from '@jsonforms/angular-material';//Import template:

//import { BaseCoreCommonComponentsBreadcrumbsComponent } from '../../modules/components/components/breadcrumbs/component';

import { BaseAppsPagesInformationIndexComponent } from './components/component';
// Import  Base.Common.Models:
import { BaseAppsPagesLandingIndexDemosComponent } from './components/components/intro/component';
import { BaseAppsPagesLandingIndexClientsComponent } from './components/components/clients/component';
import { BaseAppsPagesLandingIndexFeaturesComponent } from './components/components/features/component';
import { BaseAppsPagesLandingIndexContactComponent } from './components/components/contact/component';
import { BaseAppsPagesLandingIndexStatsComponent } from './components/components/stats/component';
import { BaseAppsPagesLandingIndexCtaComponent } from './components/components/cta/component';
import { BaseAppsPagesLandingIndexDesignedComponent } from './components/components/designed/component';
import { BaseAppsPagesLandingIndexFaqsComponent } from './components/components/faqs/component';
import { BaseAppsPagesLandingIndexPlanComponent } from './components/components/plan/component';
import { BaseAppsPagesLandingIndexReviewComponent } from './components/components/endorsements/component';
import { BaseAppsPagesLandingIndexCapabilitiesComponent } from './components/components/capabilities/component';
import { BaseAppsPagesLandingIndexTeamComponent } from './components/components/team/component';
import { BaseAppsPagesLandingIndexWorkProcessComponent } from './components/components/process/component';

import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SharedModule } from '../../../../../app/shared/module';
import { SystemDiagnosticsTraceService } from '../../../services/system.diagnostics-trace.service';
import { NgbAccordionModule, NgbCarouselModule, NgbCollapseModule, NgbDropdownModule, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CountUpModule } from 'ngx-countup';
import { BaseCoreCommonModule } from '../../common/module';
import { LandingScrollspyDirective } from '../../common/landingscrollspy.directive';
import { ScrollspyDirective } from '../../common/scrollspy.directive';
import { BaseCoreCommonComponentsModule } from '../../common/components/module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { BaseCoreHomeRoutingModule } from './routes';
import { BaseAppsPagesLandingIndexHeaderComponent } from './components/components/header/component';
import { BaseAppsPagesLandingIndexScrollBackToTopComponent } from './components/components/scrollBackToTop/component';
//NO: import { ScrollspyDirective } from '../../common/scrollspy.directive';
//import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

@NgModule({
  imports: [
    TranslateModule.forChild(),
    BaseCoreHomeRoutingModule,
    // Import classes within the above specified import files.
    //Ag specific:
    CommonModule,
    FormsModule,
    SharedModule,
    BaseCoreCommonModule,
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
    //WidgetLibraryModule // Include WidgetLibraryModule here
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
    BaseAppsPagesLandingIndexHeaderComponent,

    BaseAppsPagesLandingIndexDemosComponent,
    BaseAppsPagesLandingIndexClientsComponent,
    BaseAppsPagesLandingIndexCapabilitiesComponent,
    BaseAppsPagesLandingIndexFeaturesComponent,
    BaseAppsPagesLandingIndexDesignedComponent,
    //BaseAppsPagesLandingIndexFeaturesComponent,
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
export class BaseCoreHomeModule {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`);
  }
}
