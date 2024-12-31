import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  NgbCarouselModule, NgbTooltipModule, NgbCollapseModule, NgbNavModule, NgbAccordionModule, NgbDropdownModule
} from '@ng-bootstrap/ng-bootstrap';

import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../../../../../themes/v1/modules/unused/unsure/shared/module';

//
import { SystemDiagnosticsTraceService } from '../../../../../../core/services/system.diagnostics-trace.service';
// 
//import { BaseCorePagesLandingRoutingModule } from "./routing";

import { BaseCorePagesLandingComingSoonComponent } from '../../landing/coming-soon/component';
import { BaseCorePagesLandingIndexComponent } from '../../landing/index/component';
import { BaseCorePagesLandingMaintenanceComponent } from '../../landing/maintenance/component';
import { BaseCorePagesLandingOpportunitiesComponent } from '../../landing/opportunities/component';
import { BaseCorePagesLandingPricingComponent } from '../../landing/pricing/component';
// import { BaseCoreCommonComponentsModule } from '../../common/components/module';
import { BaseCoreLandingRoutingModule } from './routing';
import { SlickCarouselModule } from 'ngx-slick-carousel';





@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    NgbNavModule,
    NgbAccordionModule,
    NgbDropdownModule,
    NgbCarouselModule,
    SharedModule,
    NgbTooltipModule,
    NgbCollapseModule,
    ScrollToModule.forRoot(),
    // BaseCoreCommonComponentsModule,
    BaseCoreLandingRoutingModule,
        SlickCarouselModule,

  ],
  declarations: [
    BaseCorePagesLandingComingSoonComponent,
    BaseCorePagesLandingIndexComponent,
    BaseCorePagesLandingMaintenanceComponent,
    BaseCorePagesLandingOpportunitiesComponent,
    BaseCorePagesLandingPricingComponent
  ]
})
export class BaseCorePagesLandingModule {
  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    diagnosticsTraceService.debug("BaseCoreLandingModule.constructor()");

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)

  }
}
