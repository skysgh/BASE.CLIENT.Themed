// Import Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

//Import template:
import { BreadcrumbsComponent } from '../../../components/breadcrumbs/breadcrumbs.component';
//
import { BaseCommonComponmentsModule } from '../../../components/module';
import { SharedModule } from '../../../../../../app/shared/shared.module';

// Import  Base.Common.Models:

// Import  Base.Common.Services:
//import { SpikeSubSpikesRepositoryService } from './services/subspike-repository.service';

// Import Module specific.modules:
// import { SpikeSpikesModule } from "./modules/spike/module";
// Import Module specific.services:
// import { SpikeSpikesRepositoryService } from "./services/spike-repository.service"
// Import Module specific.components:
import { BaseInformationPrivacyPolicyComponent } from './ui/privacy/component';
import { BaseInformationTermsAndConditionsComponent } from './ui/terms_conditions/component';
import { DiagnosticsTraceService } from '../../../../../shared/services/diagnostics.service';
//import { DashboardsRoutingModule } from "./dashboards-routing.module";
//import { PagesRoutingModule } from "./pages-routing.module";

@NgModule({
  imports: [

    TranslateModule,
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
          { path: 'privacy', component: BaseInformationPrivacyPolicyComponent },
          { path: 'terms', component: BaseInformationTermsAndConditionsComponent },
          { path: 'termsandconditions', redirectTo:'terms'},
          { path: '', redirectTo: 'terms' },
      ]
    ),
    // Import classes within the above specified import files.
    //Ag specific:
    CommonModule,
    FormsModule,
    SharedModule,
    BaseCommonComponmentsModule
    //SpikeRoutingModule,
  ],
  exports: [
    // Not sure why doing this:
    RouterModule
  ],
  declarations: [
    // define what Components belong to this Module (i.e., are not `standalone`)
    //BaseInformationRouteOutletComponent,
    // Spike Components:
    BaseInformationPrivacyPolicyComponent,
    BaseInformationTermsAndConditionsComponent
  ],
  providers: [
    // declare services to dependency inject into constructors.
  //  SpikeSpikesRepositoryService,
  //  SpikeSubSpikesRepositoryService
  ]
})
/**
 * Information pages come under pages.
 * (see BasePagesModule)
 */
export class BasePagesInformationModule {

  constructor(private diagnosticsTraceService:DiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
  }
}
