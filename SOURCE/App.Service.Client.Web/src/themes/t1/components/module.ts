// Import Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, provideHttpClient } from '@angular/common/http';
// Etc:
//Can Remove: import { TranslateModule } from '@ngx-translate/core';
import { CountUpModule } from 'ngx-countup';
// Bootstrap:
import { NgbAccordionModule, NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
// Constants:
//
// Services:
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

// Components (Non-Standalone)
import { BaseCoreCommonComponentsBreadcrumbsComponent } from './breadcrumbs/component';
import { BaseCoreCommonComponentsSummaryItemComponent } from './summaryitem/component';
import { BaseCoreCommonComponentsSummaryItemSelectorComponent } from './sunmaryitemselector/component';
import { BaseCoreCommonComponentsFooterBComponent } from './footers/footerB/component';
import { BaseCoreCommonComponentsFooterAComponent } from './footers/footerA/component';
import { BaseCoreCommonComponentsFooterCComponent } from './footers/footerC/component';
import { BaseCommonComponentsStatsOneComponent } from './stats/one/component';
import { BaseCoreCommonComponentsFooterOComponent } from './footers/footerO/component';
import { BaseCoreCommonComponentsSocialMediaLinksComponent } from './socialmedialinks/component';
import { BaseCoreCommonComponentsCookieAlertSimpleComponent } from './cookieAlertSimple/component';
import { BaseCoreAgModule } from '../../../core.ag/module';
import { BaseThemesV1PipesModule } from '../pipes/module';
import { BaseCoreAgComponentsModule } from '../../../core.ag/components.default/module';

// NO: Parent Module:
// NO: import { BaseThemesV1Module } from '../module';

// import { BaseThemesV1CommonModule } from '../module';


//import { DashboardsRoutingModule } from "./dashboards-routing.module";
//import { PagesRoutingModule } from "./pages-routing.module";

@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    // define what Components belong to this Module (i.e., are not `standalone`)
    BaseCoreCommonComponentsCookieAlertSimpleComponent,
    BaseCoreCommonComponentsSocialMediaLinksComponent,
    BaseCoreCommonComponentsFooterOComponent,
    BaseCoreCommonComponentsFooterAComponent,
    BaseCoreCommonComponentsFooterBComponent,
    BaseCoreCommonComponentsFooterCComponent,
    BaseCoreCommonComponentsBreadcrumbsComponent,
    BaseCoreCommonComponentsSummaryItemComponent,
    BaseCoreCommonComponentsSummaryItemSelectorComponent,
    //
    BaseCommonComponentsStatsOneComponent
  ],
  providers: [
    // declare services to dependency inject into constructors.
    provideHttpClient()
    //provideMarkdown({ loader: HttpClient }),
  ],
  imports: [
    // Ag:
    CommonModule,
    RouterModule,
    //Can Remove: TranslateModule.forChild(),
    //
    NgbNavModule,
    NgbAccordionModule,
    NgbDropdownModule,
    //for at least Stats/One:
    CountUpModule,


    // Previous columns:
    BaseCoreAgComponentsModule,

    BaseThemesV1PipesModule,

    // NO: Import Parent Module:
    // NO: BaseThemesV1Module

     //NO! (cicular reference) BaseThemesV1CommonModule,
    //BaseCoreAgSupportModule,

    //BaseCoreAgModule,
    
  ],
  exports: [
    // NO: Export Parent Module: (create's circular condition)
    // NO: BaseThemesV1Module,
    // Child Modules:
    // N/A
    // Components:
    BaseCoreCommonComponentsCookieAlertSimpleComponent,
    BaseCoreCommonComponentsSocialMediaLinksComponent,
    BaseCoreCommonComponentsFooterOComponent,
    BaseCoreCommonComponentsFooterAComponent,
    BaseCoreCommonComponentsFooterBComponent,
    BaseCoreCommonComponentsFooterCComponent,
    BaseCoreCommonComponentsBreadcrumbsComponent,
    BaseCoreCommonComponentsSummaryItemComponent,
    BaseCoreCommonComponentsSummaryItemSelectorComponent,
    //
    BaseCommonComponentsStatsOneComponent
  ]
})
export class BaseThemesV1ComponentsModule {

  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
  }

}
