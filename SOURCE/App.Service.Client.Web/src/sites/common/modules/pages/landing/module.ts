import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  NgbCarouselModule, NgbTooltipModule, NgbCollapseModule, NgbNavModule, NgbAccordionModule, NgbDropdownModule
} from '@ng-bootstrap/ng-bootstrap';

import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../../../../app/unsure/shared/module';

//
import { SystemDiagnosticsTraceService } from '../../../../../core/services/system.diagnostics-trace.service';
// 
//import { BaseCorePagesLandingRoutingModule } from "./routing";

import { BaseCorePagesLandingComingSoonComponent } from './coming-soon/component';
import { BaseCorePagesLandingIndexComponent } from './index/component';
import { BaseCorePagesLandingMaintenanceComponent } from './maintenance/component';
import { BaseCorePagesLandingOpportunitiesComponent } from './opportunities/component';
import { BaseCorePagesLandingPricingComponent } from './pricing/component';
// import { BaseCoreCommonComponentsModule } from '../../common/components/module';
import { BaseCoreLandingRoutingModule } from './routing';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { BaseCoreHomeModule } from './home/module';
import { BaseCoreCommonModule } from '../../common/module';





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
    BaseCoreCommonModule,
    // BaseCoreCommonComponentsModule,
    BaseCoreLandingRoutingModule,
    BaseCoreHomeModule,
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

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)

  }
}
