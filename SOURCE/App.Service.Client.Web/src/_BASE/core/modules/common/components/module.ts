// Import Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, provideHttpClient } from '@angular/common/http';
// Etc:
import { TranslateModule } from '@ngx-translate/core';
import { CountUpModule } from 'ngx-countup';
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';
import { PdfViewerModule } from 'ng2-pdf-viewer';
// Bootstrap:
import { NgbAccordionModule, NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
// Constants:
import { system as importedSystemConst } from '../../../constants/system';
// Services:
import { SystemDiagnosticsTraceService } from '../../../services/system.diagnostics-trace.service';

// Components
import { BaseCoreCommonComponentsBreadcrumbsComponent } from './breadcrumbs/component';
import { BaseCoreCommonComponentsGoogleAnalyticsComponent } from './google-analytics/component';
import { BaseCoreCommonComponentsGoogleMapsComponent } from './google-maps/component';
import { BaseCoreCommonComponentsMarkdownComponent } from './markdown/component';
import { BaseCoreCommonComponentsPdfComponent } from './pdf/component';
import { BaseCoreCommonComponentsSummaryItemComponent } from './summaryitem/component';
import { BaseCoreCommonComponentsSummaryItemSelectorComponent } from './sunmaryitemselector/component';
import { BaseCoreCommonComponentsFooterBComponent } from './footers/footerB/component';
import { BaseCoreCommonComponentsFooterAComponent } from './footers/footerA/component';
import { BaseCoreCommonComponentsFooterCComponent } from './footers/footerC/component';
import { BaseCoreCommonComponentTopBarLanguageComponent } from './language/component';
import { BaseCommonComponentsStatsOneComponent } from './stats/one/component';
import { BaseCoreCommonComponentsSignUpInComponent } from './signupin/component';
import { BaseCoreCommonComponentsFooterOComponent } from './footers/footerO/component';
import { BaseCoreCommonComponentsSocialMediaLinksComponent } from './socialmedialinks/component';
import { BaseCoreCommonComponentsCookieAlertSimpleComponent } from './cookieAlertSimple/component';


//import { DashboardsRoutingModule } from "./dashboards-routing.module";
//import { PagesRoutingModule } from "./pages-routing.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule.forChild(),
    NgbNavModule,
    NgbAccordionModule,
    NgbDropdownModule,
    MarkdownModule.forChild(),
    PdfViewerModule,
    //for at least Stats/One:
    CountUpModule
  ],
  declarations: [
    // define what Components belong to this Module (i.e., are not `standalone`)

    
    BaseCoreCommonComponentsCookieAlertSimpleComponent,
    BaseCoreCommonComponentsSocialMediaLinksComponent,
    BaseCoreCommonComponentsFooterOComponent,
    BaseCoreCommonComponentsFooterAComponent,
    BaseCoreCommonComponentsFooterBComponent,
    BaseCoreCommonComponentsFooterCComponent,
    BaseCoreCommonComponentsBreadcrumbsComponent,
    BaseCoreCommonComponentTopBarLanguageComponent,
    BaseCoreCommonComponentsGoogleAnalyticsComponent,
    BaseCoreCommonComponentsGoogleMapsComponent,
    BaseCoreCommonComponentsMarkdownComponent,
    BaseCoreCommonComponentsPdfComponent,
    BaseCoreCommonComponentsSummaryItemComponent,
    BaseCoreCommonComponentsSummaryItemSelectorComponent,
    //
    BaseCommonComponentsStatsOneComponent,
    BaseCoreCommonComponentsSignUpInComponent
  ],
  exports: [
    BaseCoreCommonComponentsCookieAlertSimpleComponent,
    BaseCoreCommonComponentsSocialMediaLinksComponent,
    BaseCoreCommonComponentsFooterOComponent,
    BaseCoreCommonComponentsFooterAComponent,
    BaseCoreCommonComponentsFooterBComponent,
    BaseCoreCommonComponentsFooterCComponent,
    BaseCoreCommonComponentsBreadcrumbsComponent,
    BaseCoreCommonComponentTopBarLanguageComponent,
    BaseCoreCommonComponentsGoogleAnalyticsComponent,
    BaseCoreCommonComponentsGoogleMapsComponent,
    BaseCoreCommonComponentsMarkdownComponent,
    BaseCoreCommonComponentsPdfComponent,
    BaseCoreCommonComponentsSummaryItemComponent,
    BaseCoreCommonComponentsSummaryItemSelectorComponent,
    //
    BaseCoreCommonComponentsSignUpInComponent,
    //
    BaseCommonComponentsStatsOneComponent
  ],
  providers: [
    // declare services to dependency inject into constructors.
    provideHttpClient()
    //provideMarkdown({ loader: HttpClient }),
  ]
})
export class BaseCoreCommonComponentsModule {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;
  constructor(private diagnosticsTraceService:SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
  }

}
