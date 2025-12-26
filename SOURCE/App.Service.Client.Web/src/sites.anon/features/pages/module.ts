// Rx:
//
// Import Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
//Can Remove: import { TranslateModule } from '@ngx-translate/core';

//Import template:

// Import  Base.Common.Models:

// Import  Base.Common.Services:
//import { SpikeSubSpikesRepositoryService } from './services/subspike-repository.service';

// Import Module specific.modules:
// import { SpikeSpikesModule } from "./modules/spike/module";
// Import Module specific.services:
// import { SpikeSpikesRepositoryService } from "./services/spike-repository.service"
// Import Module specific.components:
import { BaseCorePagesROComponent } from './components/_routeoutlet/component';
import { BaseCorePagesInformationModule } from './information/module';
import { BaseCorePagesLandingModule } from './landing/module';

import { BaseThemesV1Module } from '../../../themes/t1/module';
//import { BaseLayoutFooterComponent } from '../layouts/footer/component';


//import { DashboardsRoutingModule } from "./dashboards-routing.module";
//import { PagesRoutingModule } from "./pages-routing.module";

// Services:
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { BaseThemesModule } from '../../../themes/module';
// Configuration:
import { appsConfiguration } from '../../../apps/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../configuration/implementation/sites.configuration';
// NO: Parent Module:
// import { BaseCoreSitesFeaturesModule } from '../module';

@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    BaseCorePagesROComponent,

    //BaseLayoutFooterComponent,

  ],
  providers: [
    // declare services to dependency inject into constructors.
  ],
  imports: [
    CommonModule,

    // Import Base of Upstream Column: THemes, which depends on Core.Ag:
    BaseThemesModule,
    //Can Remove: TranslateModule.forChild(),
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
        { path: 'landing', loadChildren: () => import('./landing/module').then(m => m.BaseCorePagesLandingModule) },
        { path: 'information', loadChildren: () => import('./information/module').then(m => m.BaseCorePagesInformationModule) },
      ]
    ),
    // Import classes within the above specified import files.
    //Ag specific:
    FormsModule,

    
    // Child Modules:
    BaseCorePagesLandingModule,
    BaseCorePagesInformationModule,
    // Module specific:
    //SpikeRoutingModule,
    // NO: Import Parent Module:
    // NO: BaseCoreSitesFeaturesModule
  ],
  exports: [
    // Not sure why doing this:
    //RouterModule,

    //BaseLayoutFooterComponent,

    // NO: Export Parent Module:
    // NO: BaseCoreSitesFeaturesModule
  ]
})
export class BaseCoreSitesFeaturesPagesModule {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration


  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug("BasePagesModule.constructor()");
  }
}
