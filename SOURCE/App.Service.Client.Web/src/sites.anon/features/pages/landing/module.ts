// Rx:
//
// Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// Etc:
import {
  NgbCarouselModule, NgbTooltipModule, NgbCollapseModule, NgbNavModule, NgbAccordionModule, NgbDropdownModule
} from '@ng-bootstrap/ng-bootstrap';

// Configuration:
import { appsConfiguration } from '../sites.app/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../configuration/implementation/sites.configuration';
// Services:
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';
// Modules:
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { SlickCarouselModule } from 'ngx-slick-carousel';
// NO: Parent Module:
// NO: import { BaseCoreSitesFeaturesPagesModule } from '../module';
// Routing Module:
import { BaseCoreLandingRoutingModule } from './routing';
// Child Modules:
import { BaseCoreHomeModule } from './home/module';
// Components:
import { BaseCorePagesLandingComingSoonComponent } from './coming-soon/component';
import { BaseCorePagesLandingIndexComponent } from './index/component';
import { BaseCorePagesLandingMaintenanceComponent } from './maintenance/component';
import { BaseCorePagesLandingOpportunitiesComponent } from './opportunities/component';
import { BaseCorePagesLandingPricingComponent } from './pricing/component';
import { BaseThemesModule } from '../../../../themes/module';



@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    BaseCorePagesLandingComingSoonComponent,
    BaseCorePagesLandingIndexComponent,
    BaseCorePagesLandingMaintenanceComponent,
    BaseCorePagesLandingOpportunitiesComponent,
    BaseCorePagesLandingPricingComponent
  ],
  providers: [
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

    // Import Base of Upstream Column: Themes, and thereby Core.Ag: 
    BaseThemesModule,

    // NO: Import Parent Module:
    // NO: BaseCoreSitesFeaturesPagesModule,
    // Routing:
    BaseCoreLandingRoutingModule,
    // Child Modules:
    BaseCoreHomeModule,
    SlickCarouselModule
  ],
  exports: [
    // NO: Export Parent Module:
    // NO: BaseCorePagesModule,
  ]
})
export class BaseCorePagesLandingModule {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)

  }
}
