// Rx:
//
// Ag:
import { Component, Input, OnInit} from "@angular/core";
// Etc:
//import { MarkdownService } from 'ngx-markdown';
// Constants:
import { system as importedSystemConst } from '../../../../constants/system';
// Services:
import { SystemDiagnosticsTraceService } from "../../../../services/system.diagnostics-trace.service";
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
