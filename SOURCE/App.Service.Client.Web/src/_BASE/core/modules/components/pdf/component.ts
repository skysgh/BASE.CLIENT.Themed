
import { Component, Input, OnInit} from "@angular/core";
//import { MarkdownService } from 'ngx-markdown';

import { DiagnosticsTraceService } from "../../../../shared/services/diagnostics.service";

/**
 * See: https://www.npmjs.com/package/ng2-pdf-viewer
 */
@Component({
  selector: 'app-base-components-pdf',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseComponentsPdfComponent implements OnInit {

  @Input("src")
  public src: string|undefined =undefined;


  @Input("data")
  public data: string|undefined=undefined;

  @Input("renderText")
  public renderText: number = 1;

  @Input("renderTextMode")
  public renderTextMode: string | undefined = "1";

  @Input("page")
  public page: number = 1;

  @Input("originalSize")
  public originalSize :boolean= false;

  @Input("externalLinkTarget")
  public externalLinkTarget: string = "blank";

  @Input("zoom")
  public zoom: number = 1.0;

  @Input("zoomScale")
  public zoomScale: string = "page-width";

  @Input("showBorders")
  public showBorders: boolean = true;

  //style = "width: 400px; height: 500px"

  constructor(private diagnosticTraceService: DiagnosticsTraceService) {
    this.diagnosticTraceService.debug(`${this.constructor.name}.construtor()`);
  }

  ngOnInit(): void {
    this.diagnosticTraceService.debug(`${this.constructor.name}.onInit()`);
  }


}



