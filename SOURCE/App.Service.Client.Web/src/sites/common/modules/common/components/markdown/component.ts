// Rx:
//
// Ag:
import { Component, Input, OnInit} from "@angular/core";
// Etc:
//import { MarkdownService } from 'ngx-markdown';
// Constants:
import { system as importedSystemConst } from '../../../../../../core/constants/system';
// Pipes:
import { BaseTranslatePipe } from '../../../../../../core.ui/pipes/basetranslate.pipe';
// Services:
import { SystemDiagnosticsTraceService } from "../../../../../../core/services/system.diagnostics-trace.service";
import { ViewModel } from "./vm";
// Models:
//
// Data:
//

/**
 * See: https://jfcere.github.io/ngx-markdown/get-started
 */
@Component({
  selector: 'app-base-core-common-components-markdown',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class BaseCoreCommonComponentsMarkdownComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  @Input()
  public src: string|null =null;


  @Input()
  public data: string|null=null;


  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.onInit()`);
  }


}
