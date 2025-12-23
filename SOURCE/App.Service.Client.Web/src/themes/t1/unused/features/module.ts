// Rx:

// Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// Misc:
import { NgbAccordionModule, NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CountUpModule } from 'ngx-countup';
import { SlickCarouselModule } from 'ngx-slick-carousel';
// NO: Parent Module:
// NO: import { BaseThemesV1UnusedModule } from '../module';
// Child Modules:
import { BaseThemesV1UnusedFeatures2AnalyticsModule } from './analytics/module';
import { BaseThemesV1UnusedFeaturesBlogModule } from './blog/module';
import { BaseThemesV1UnusedFeatures2CrmModule } from './crm/module';
import { BaseThemesV1UnusedFeatures2CryptoModule } from './crypto/module';
import { BaseThemesV1UnusedFeatures2DashboardModule } from './dashboard/module';
import { BaseThemesV1UnusedFeaturesJobsModule } from './job/module';
import { BaseThemesV1UnusedFeatures2ProjectsModule } from './projects/module';

@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
  ],
  providers: [],
  imports: [
    CommonModule,
    // Etc: -
    // TODO: but these might need to be put into the specific ones that rely on them.
    RouterModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbDropdownModule,
    CountUpModule,
    SlickCarouselModule,

    // NO: Import Parent Module:
    // NO: BaseThemesV1UnusedModule,
    // N/A since unused.
    // Child Modules:
    BaseThemesV1UnusedFeaturesBlogModule,
    BaseThemesV1UnusedFeatures2AnalyticsModule,
    BaseThemesV1UnusedFeatures2CrmModule,
    BaseThemesV1UnusedFeatures2CryptoModule,
    BaseThemesV1UnusedFeatures2DashboardModule,
    BaseThemesV1UnusedFeaturesJobsModule,
    BaseThemesV1UnusedFeatures2CrmModule,
    BaseThemesV1UnusedFeatures2ProjectsModule,
    //
  ],
  exports: [
    // NO: Export Parent Module:
    // NO: BaseThemesV1UnusedModule,
    // Child Modules:
    BaseThemesV1UnusedFeaturesBlogModule,
    BaseThemesV1UnusedFeatures2AnalyticsModule,
    BaseThemesV1UnusedFeatures2CrmModule,
    BaseThemesV1UnusedFeatures2CryptoModule,
    BaseThemesV1UnusedFeatures2DashboardModule,
    BaseThemesV1UnusedFeaturesJobsModule,
    BaseThemesV1UnusedFeatures2CrmModule,
    BaseThemesV1UnusedFeatures2ProjectsModule,
  ]
})
export class BaseThemesV1UnusedFeaturesModule { }
