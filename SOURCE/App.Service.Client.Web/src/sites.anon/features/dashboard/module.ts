// Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
//
import { BaseCoreDashboardsIndexComponent } from './ui/views/dashboard-index/component';
// import { BaseCoreCommonComponentsModule } from '../common/components/module';
import { BaseCoreDashboardsRouterModule } from './routes';
import { DashboardService } from './services/service.dashboard.service';
import { BaseCoreSitesModule } from '../../module';
import { BaseThemesModule } from '../../../themes/module';
// NO: Parent Module:
// import { BaseThemesV1FeaturesModule } from '../../../themes/t1/features/module';
//
//import { StatComponent } from './hold/stat/component';
//import { DashboardComponent } from './ui/component';

//import Module specific:
@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    BaseCoreDashboardsIndexComponent
  ],
  providers: [
    // declare services to dependency inject into constructors.
    // define what Services
    //DiagnosticsTraceService,
    DashboardService
  ],
  imports: [
    // Import classes within the above specified import files.
    // Ag specific:
    CommonModule,

    // Import Base of Upstream Column: Themes, and thereby Core.Ag: 
    BaseThemesModule,

    // NO: Import Parent Module:
    // NO: BaseThemesV1FeaturesModule,
    // Module specific:
    //No BaseCoreCommonComponentsModule,
    // Routes
    BaseCoreDashboardsRouterModule,

    //BaseCoreSitesModule
  ],
  exports: [
    // NO: Export Parent Module:
    // NO: BaseThemesV1FeaturesModule,
  ]
})
export class BaseCoreDashboardsModule { }
