// Import Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { BaseComponentsMarkdownComponent } from './markdown/component';
import { DiagnosticsTraceService } from '../../../shared/services/diagnostics.service';

import { MarkdownModule, provideMarkdown } from 'ngx-markdown';
import { HttpClient, provideHttpClient } from '@angular/common/http';

//import { DashboardsRoutingModule } from "./dashboards-routing.module";
//import { PagesRoutingModule } from "./pages-routing.module";

@NgModule({
  imports: [
    CommonModule,
    MarkdownModule.forChild(),
    TranslateModule
  ],
  exports: [
    BaseComponentsMarkdownComponent
  ],
  declarations: [
    // define what Components belong to this Module (i.e., are not `standalone`)
    BaseComponentsMarkdownComponent
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
