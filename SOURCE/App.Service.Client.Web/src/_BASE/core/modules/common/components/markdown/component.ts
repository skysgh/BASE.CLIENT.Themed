
import { Component, Input, OnInit} from "@angular/core";
//import { MarkdownService } from 'ngx-markdown';

import { DiagnosticsTraceService } from "../../../../services/diagnostics.service";

/**
 * See: https://jfcere.github.io/ngx-markdown/get-started
 */
@Component({
  selector: 'app-base-core-common-components-markdown',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class BaseCoreCommonComponentsMarkdownComponent implements OnInit {

  @Input()
  public src: string|null =null;


  @Input()
  public data: string|null=null;


  constructor(private diagnosticsTraceService: DiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.onInit()`);
  }


}
