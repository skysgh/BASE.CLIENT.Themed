
import { Component, Input, OnInit} from "@angular/core";
//import { MarkdownService } from 'ngx-markdown';

import { DiagnosticsTraceService } from "../../../../shared/services/diagnostics.service";

@Component({
  selector: 'app-base-components-markdown',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseComponentsPdfComponent implements OnInit {

  @Input()
  public src: string|undefined =undefined;


  @Input()
  public data: string|undefined=undefined;

  constructor(private diagnosticTraceService: DiagnosticsTraceService) {
    this.diagnosticTraceService.debug(`${this.constructor.name}.construtor()`);
  }

  ngOnInit(): void {
    this.diagnosticTraceService.debug(`${this.constructor.name}.onInit()`);
  }


}
