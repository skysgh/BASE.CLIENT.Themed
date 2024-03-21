// Import Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

import { DiagnosticsTraceService } from '../../../shared/services/diagnostics.service';

import { BaseComponentsMarkdownComponent } from './markdown/component';
import { BaseComponentsPdfComponent } from './pdf/component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { BaseComponentsSummaryItemComponent } from './summaryitem/component';
import { BaseComponentsSummaryItemSelectorComponent } from './sunmaryitemselector/component';

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
    BaseComponentsMarkdownComponent,
    BaseComponentsPdfComponent,
    BaseComponentsSummaryItemComponent,
    BaseComponentsSummaryItemSelectorComponent
  ],
  declarations: [
    // define what Components belong to this Module (i.e., are not `standalone`)
    BaseComponentsMarkdownComponent,
    BaseComponentsPdfComponent,
    BaseComponentsSummaryItemComponent,
    BaseComponentsSummaryItemSelectorComponent
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
