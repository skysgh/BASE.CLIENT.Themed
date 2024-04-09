// Import Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

//Import template:
import { SharedModule } from '../../../../app/shared/module';
// Import  Base.Common.Models:

// Import  Base.Common.Services:
//import { SpikeSubSpikesRepositoryService } from './services/subspike-repository.service';

// Import Module specific.modules:
// import { SpikeSpikesModule } from "./modules/spike/module";
// Import Module specific.services:
// import { SpikeSpikesRepositoryService } from "./services/spike-repository.service"
// Import Module specific.components:
import { BaseCorePagesROComponent } from './components/_routeoutlet/component';
import { SystemDiagnosticsTraceService } from '../../services/system.diagnostics-trace.service';
import { BaseCoreCommonModule } from '../common/module';
import { BaseCorePagesInformationModule } from './information/module';
import { BaseCorePagesLandingModule } from './landing/module';
//import { BaseLayoutFooterComponent } from '../layouts/footer/component';


//import { DashboardsRoutingModule } from "./dashboards-routing.module";
//import { PagesRoutingModule } from "./pages-routing.module";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
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
        { path: 'information', loadChildren: () => import('./information/module').then(m => m.BaseCorePagesInformationModule) },
        { path: 'landing', loadChildren: () => import('./landing/module').then(m => m.BaseCorePagesLandingModule) },
      ]
    ),
    // Import classes within the above specified import files.
    //Ag specific:
    FormsModule,
    SharedModule,
    BaseCoreCommonModule,
    BaseCorePagesLandingModule,
    BaseCorePagesInformationModule
    // Module specific:
    //SpikeRoutingModule,


  ],
  exports: [
    // Not sure why doing this:
    RouterModule,

    //BaseLayoutFooterComponent,

  ],
  declarations: [
    // define what Components belong to this Module (i.e., are not `standalone`)
  BaseCorePagesROComponent,

    //BaseLayoutFooterComponent,

  ],
  providers: [
    // declare services to dependency inject into constructors.
  ]
})
export class BaseCorePagesModule {

  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug("BasePagesModule.constructor()");
  }
}
