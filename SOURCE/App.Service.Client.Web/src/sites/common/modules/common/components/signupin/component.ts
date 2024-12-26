// rx:
import { Subscription } from "rxjs";
// Ag:
import { Component, Input, OnDestroy, OnInit, Output } from "@angular/core";
// Etc:
//import { MarkdownService } from 'ngx-markdown';
// Constants:
import { system as importedSystemConst } from '../../../../../../core/constants/system';
// Services:
import { SystemDiagnosticsTraceService } from "../../../../../../core/services/system.diagnostics-trace.service";
import { ViewModel } from "./vm";

/**
 * See: https://www.npmjs.com/package/ng2-pdf-viewer
 */
@Component({
  selector: 'app-base-core-common-components-signupin',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentsSignUpInComponent implements OnInit, OnDestroy {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  constructor(
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
  ) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);

    // Too early to pick up bound src.
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.onInit()`);

  }


  ngOnDestroy(): void {
  }
}
