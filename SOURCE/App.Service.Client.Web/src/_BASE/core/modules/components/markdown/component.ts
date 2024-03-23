
import { Component, Input, OnInit} from "@angular/core";
//import { MarkdownService } from 'ngx-markdown';

import { DiagnosticsTraceService } from "../../../../shared/services/diagnostics.service";

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


  constructor(private diagnosticTraceService: DiagnosticsTraceService) {
    this.diagnosticTraceService.debug(`${this.constructor.name}.construtor()`);
  }

  ngOnInit(): void {
    this.diagnosticTraceService.debug(`${this.constructor.name}.onInit()`);
  }


}
