// Rx:
//
// Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// Etc:
//Can Remove: import { TranslateModule } from '@ngx-translate/core';
//import { JsonFormsModule } from '@jsonforms/angular';
//import { JsonFormsAngularMaterialModule } from '@jsonforms/angular-material';//Import template:
// Configuration:

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

import { SlickCarouselModule } from 'ngx-slick-carousel';

import { NgbAccordionModule, NgbCarouselModule, NgbCollapseModule, NgbDropdownModule, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CountUpModule } from 'ngx-countup';

import { BaseThemesV1DirectivesModule } from '../../../../../themes/t1/directives/module';
import { LandingScrollspyDirective } from    '../../../../../themes/t1/directives/landingscrollspy.directive';
import { ScrollspyDirective } from '../../../../../themes/t1/directives/scrollspy.directive';

import { SystemDiagnosticsTraceService } from '../../../../../core/services/system.diagnostics-trace.service';

// import { BaseCoreCommonComponentsModule } from '../../../common/components/module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { BaseAppsPagesLandingIndexHeaderComponent } from './components/header/component';
//import { BaseAppsPagesLandingIndexScrollBackToTopComponent } from '_root';
import { BaseThemesModule } from '../../../../../themes/module';
import { BaseThemesV1Module } from '../../../../../themes/t1/module';
import { appsConfiguration } from '../sites.app/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../configuration/implementation/sites.configuration';
import { BaseAppsPagesLandingIndexScrollBackToTopComponent } from './components/scrollBackToTop/BaseAppsPagesLandingIndexScrollBackToTopComponent';
import { BaseCoreAgModule } from '../../../../../core.ag/module';
import { BaseAppsPagesLandingIndexWorkProcessComponent } from './components/process/component';
// NO: Parent Module:
// NO: import { BaseCoreSitesFeaturesPagesModule } from '../../module';
//NO: import { ScrollspyDirective } from '../../common/scrollspy.directive';
//import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
// Module:


@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
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
    // Components, Directives, Pipes developed in this Module.
  ],
  imports: [
    //Can Remove: TranslateModule.forChild(),
    // Import classes within the above specified import files.
    //Ag specific:
    CommonModule,
    RouterModule,
    FormsModule,


    // Module specific:
    //ScrollToModule,
    //SlickCarouselModule,
    //NgbNavModule,
    NgbCarouselModule,
    NgbAccordionModule,
    //NgbDropdownModule,
    //CountUpModule,
//     BaseCoreCommonComponentsModule,
    NgbTooltipModule,
    NgbCollapseModule,
    SlickCarouselModule,
    CountUpModule,
    //WidgetLibraryModule // Include WidgetLibraryModule here
  //  LandingScrollspyDirective,
    //  ScrollspyDirective
    ScrollToModule.forRoot(),
    // Import Base of Upstream Column: THemes, which depends on Core.Ag:
    //BaseThemesModule,
    BaseThemesV1Module,
    // Dependencies:
    BaseThemesV1DirectivesModule,
    // NO: Import Parent Module:
    // NO: BaseCoreSitesFeaturesPagesModule
    BaseCoreAgModule

  ],

  exports: [

    BaseThemesModule,
    BaseThemesV1Module,
    // Components:
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
    // NO: Export Parent Module:
    // NO: BaseCoreSitesFeaturesPagesModule
  ]
})
export class BaseCoreLandingSharedPartsModule {

  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration
  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`);
  }
}
