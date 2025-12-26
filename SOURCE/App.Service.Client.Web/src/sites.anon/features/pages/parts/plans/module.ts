import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  NgbCarouselModule, NgbTooltipModule, NgbCollapseModule, NgbNavModule, NgbAccordionModule, NgbDropdownModule
} from '@ng-bootstrap/ng-bootstrap';

import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

//Can Remove: import { TranslateModule } from '@ngx-translate/core';

//
import { SystemDiagnosticsTraceService } from '../../../../../core/services/system.diagnostics-trace.service';
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
import { BaseThemesModule } from '../../../../../themes/module';
import { appsConfiguration } from '../../../../../sites.app/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../configuration/implementation/sites.configuration';

// NO: Parent Module:
// NO: import { BaseCoreSitesFeaturesPagesModule } from '../../module';





@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    //BaseCorePagesLandingComingSoonComponent,
    //BaseCorePagesLandingIndexComponent,
    //BaseCorePagesLandingMaintenanceComponent,
    //BaseCorePagesLandingOpportunitiesComponent,
    //BaseCorePagesLandingPricingComponent
  ],
  providers: [
    // declare services to dependency inject into constructors.
  ],
  imports: [
    CommonModule,
    //Can Remove: TranslateModule.forChild(),
    NgbNavModule,
    NgbAccordionModule,
    NgbDropdownModule,
    NgbCarouselModule,
    NgbTooltipModule,
    NgbCollapseModule,
    //ScrollToModule.forRoot(),
    // BaseCoreCommonComponentsModule,
    SlickCarouselModule,
    // Import Base of Upstream Column: THemes, which depends on Core.Ag:
    BaseThemesModule,
   // Routes:
    BaseCoreLandingRoutingModule,
    // NO: Import Parent Module:
    // NO: BaseCoreSitesFeaturesPagesModule
    // Child Modules:
    // N/A
  ],
  exports: [
    // NO: Export Parent Module:
    // NO: BaseCoreSitesFeaturesPagesModule
    // Child Modules:
    // N/A
  ]
})
export class BaseCorePagesLandingModule {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration
  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    diagnosticsTraceService.debug("BaseCoreLandingModule.constructor()");

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)

  }
}
