// Import Ag:
import { ReactiveFormsModule } from '@angular/forms';
// Services:


// Import  Base.Common.Models:

// Import  Base.Common.Services:
//import { SpikeSubSpikesRepositoryService } from './services/subspike-repository.service';

// Import Module specific.modules:
// import { SpikeSpikesModule } from "./modules/spike/module";
// Import Module specific.services:
// import { SpikeSpikesRepositoryService } from "./services/spike-repository.service"
// Import Module specific.components:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
//Can Remove: import { TranslateModule } from '@ngx-translate/core';
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';
// import { BaseCoreCommonComponentsModule } from '../../common/components/module';
// ✅ UPDATED: Path changed from ./components/ to ./ui/views/
import { BaseCorePagesInformationPrivacyPolicyComponent } from './ui/views/privacy/component';
import { BaseCorePagesInformationTermsComponent } from './ui/views/terms/component';
import { BaseCorePagesInformationCorrectionsComponent } from './ui/views/corrections/component';
import { BaseCorePagesInformationSupportComponent } from './ui/views/support/component';
import { BaseCorePagesInformationIndexComponent } from './ui/views/index/component';
import { BaseCorePagesInformationContactComponent } from './ui/views/contact/component';
// ✅ UPDATED: Path changed from ./ui/views/index/components/ to ./ui/viewsections/
import { BaseAppsPagesLandingIndexHeaderComponent } from './ui/viewsections/header/component';
import { BaseThemesModule } from '../../../../themes/module';
import { BaseCoreAgComponentsSpecificModule } from '../../../../core.ag/components.specific/module';

//import { DashboardsRoutingModule } from "./dashboards-routing.module";
//import { PagesRoutingModule } from "./pages-routing.module";
@NgModule({
  declarations: [
    // define what Components belong to this Module (i.e., are not `standalone`)
    //BaseInformationRouteOutletComponent,
    // Spike Components:
    BaseAppsPagesLandingIndexHeaderComponent,
    BaseCorePagesInformationIndexComponent,
    BaseCorePagesInformationContactComponent,
    BaseCorePagesInformationCorrectionsComponent,
    BaseCorePagesInformationPrivacyPolicyComponent,
    BaseCorePagesInformationSupportComponent,
    BaseCorePagesInformationTermsComponent
  ],
  providers: [
    // declare services to dependency inject into constructors.
    //  SpikeSpikesRepositoryService,
    //  SpikeSubSpikesRepositoryService
  ],
  imports: [
    CommonModule,
    // Import Base of Upstream Column: Themes, and thereby Core.Ag: 
    BaseThemesModule,

    BaseCoreAgComponentsSpecificModule,
    //Can Remove: TranslateModule.forChild(),
    RouterModule.forChild(
      [
        // we're basically saying load:
        // parent that base router imported
        // into 'pages' this module.
        // which has route for children.
        // the default route imports .
        // which is the landing moudl
        // Hence 'pages/landing/' will come up first.
        //// which happens to be a router-output, and into that
        //// load the module for specific group of views:
        { path: '', component: BaseCorePagesInformationIndexComponent },
        { path: 'contact', component: BaseCorePagesInformationContactComponent },
        { path: 'corrections', component: BaseCorePagesInformationCorrectionsComponent },
        { path: 'privacy', component: BaseCorePagesInformationPrivacyPolicyComponent },
        { path: 'support', component: BaseCorePagesInformationSupportComponent },
        { path: 'terms', component: BaseCorePagesInformationTermsComponent },
        // Redirections:
        { path: 'termsandconditions', redirectTo: 'terms' },
      ]
    ),
    // Import classes within the above specified import files.
    //Ag specific:
    FormsModule,
    // NO: BaseCoreSitesFeaturesPagesModule
    // BaseCoreCommonComponentsModule
    //SpikeRoutingModule,
  ],
  exports: [
    // Not sure why doing this:
    RouterModule,
    BaseThemesModule
  ]
})
/**
 * Information pages come under pages.
 * (see BasePagesModule)
 */
export class BaseCorePagesInformationModule {

  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`);
  }
}
