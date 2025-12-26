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
// ✅ Import parent module to get access to its providers (tokens)
import { BaseCoreSitesModule } from '../../module';
// Configuration:
import { appsConfiguration } from '../../../sites.app/configuration/implementations/apps.configuration';
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

    // ✅ Import parent module FIRST to get token providers
    BaseCoreSitesModule,
    
    // Import Base of Upstream Column: Themes, which depends on Core.Ag:
    BaseThemesModule,
    
    RouterModule.forChild(
      [
        // Lazy load child feature modules
        { path: 'landing', loadChildren: () => import('./landing/module').then(m => m.BaseCorePagesLandingModule) },
        { path: 'information', loadChildren: () => import('./information/module').then(m => m.BaseCorePagesInformationModule) },
      ]
    ),
    
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
