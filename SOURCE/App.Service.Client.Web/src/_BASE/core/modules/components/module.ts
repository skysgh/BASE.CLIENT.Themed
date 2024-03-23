// Import Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
// Services:
import { DiagnosticsTraceService } from '../../../shared/services/diagnostics.service';

// Components
import { BaseCoreCommonComponentsGoogleAnalyticsComponent } from './google-analytics/component';
import { BaseCoreCommonComponentsGoogleMapsComponent } from './google-maps/component';
import { BaseCoreCommonComponentsMarkdownComponent } from './markdown/component';
import { BaseCoreCommonComponentsPdfComponent } from './pdf/component';
import { BaseCoreCommonComponentsSummaryItemComponent } from './summaryitem/component';
import { BaseCoreCommonComponentsSummaryItemSelectorComponent } from './sunmaryitemselector/component';

//import { DashboardsRoutingModule } from "./dashboards-routing.module";
//import { PagesRoutingModule } from "./pages-routing.module";

@NgModule({
  imports: [
    CommonModule,
    MarkdownModule.forChild(),
    PdfViewerModule,
    TranslateModule
  ],
  exports: [
    BaseCoreCommonComponentsGoogleAnalyticsComponent,
    BaseCoreCommonComponentsGoogleMapsComponent,
    BaseCoreCommonComponentsMarkdownComponent,
    BaseCoreCommonComponentsPdfComponent,
    BaseCoreCommonComponentsSummaryItemComponent,
    BaseCoreCommonComponentsSummaryItemSelectorComponent
  ],
  declarations: [
    // define what Components belong to this Module (i.e., are not `standalone`)
    BaseCoreCommonComponentsGoogleAnalyticsComponent,
    BaseCoreCommonComponentsGoogleMapsComponent,
    BaseCoreCommonComponentsMarkdownComponent,
    BaseCoreCommonComponentsPdfComponent,
    BaseCoreCommonComponentsSummaryItemComponent,
    BaseCoreCommonComponentsSummaryItemSelectorComponent
  ],
  providers: [
    // declare services to dependency inject into constructors.
    provideHttpClient(),
    //provideMarkdown({ loader: HttpClient }),
  ]
})
export class BaseCommonComponmentsModule {

  constructor(private diagnosticsTraceService:DiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
  }

}
