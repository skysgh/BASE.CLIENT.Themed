// Import Ag:
import { NgbAccordionModule, NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, provideHttpClient } from '@angular/common/http';

import { TranslateModule } from '@ngx-translate/core';
import { CountUpModule } from 'ngx-countup';
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';
import { PdfViewerModule } from 'ng2-pdf-viewer';
// Services:
import { DiagnosticsTraceService } from '../../../services/diagnostics.service';

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
import { RouterModule } from '@angular/router';
import { BaseCoreCommonComponentsFooterOComponent } from './footers/footerO/component';
import { BaseCoreCommonComponentsSocialMediaLinksComponent } from './socialmedialinks/component';


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

  constructor(private diagnosticsTraceService:DiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
  }

}
