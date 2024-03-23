
import { Component, Input, OnDestroy, OnInit, Output} from "@angular/core";
//import { MarkdownService } from 'ngx-markdown';

import { DiagnosticsTraceService } from "../../../../shared/services/diagnostics.service";
import { PdfService } from "../../../../shared/services/pdf.service";
import { Subscription } from "rxjs";

/**
 * See: https://www.npmjs.com/package/ng2-pdf-viewer
 */
@Component({
  selector: 'app-base-core-common-components-pdf',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentsPdfComponent implements OnInit, OnDestroy {

  @Input("src")
  public src: string | undefined = undefined;

  @Input("replacements")
  public replacements: { [key: string]: string }|undefined = {};

  @Output("processedSrc")
  public processedSrc: string | undefined = undefined;

  @Input("data")
  public data: string | undefined = undefined;

  @Input("renderText")
  public renderText: number = 1;

  @Input("renderTextMode")
  public renderTextMode: string | undefined = "1";

  @Input("page")
  public page: number = 1;

  @Input("originalSize")
  public originalSize: boolean = false;

  @Input("externalLinkTarget")
  public externalLinkTarget: string = "blank";

  @Input("zoom")
  public zoom: number = 1.0;

  @Input("zoomScale")
  public zoomScale: string = "page-width";

  @Input("showBorders")
  public showBorders: boolean = true;

  //style = "width: 400px; height: 500px"

  private pdfSubscription: Subscription|undefined;

  constructor(
    private diagnosticTraceService: DiagnosticsTraceService,
    private pdfService: PdfService) {
    this.diagnosticTraceService.debug(`${this.constructor.name}.construtor()`);

  }

  ngOnInit(): void {
    this.diagnosticTraceService.debug(`${this.constructor.name}.onInit()`);
    this.doWork();
  }

  doWork() {
    if (this.src) {
      if (this.replacements) {
        //
        this.pdfSubscription =
          this.pdfService.fetchAndReplacePdfTokens(this.src, this.replacements,true)
            .subscribe(url => {
              // will be something like:
              // blob:http://localhost:4200/16f2f67c-6bba-430b-af75-a99e54b45b55
              this.processedSrc = url;
            });
      } else {
        //just make it the same
        // and let it get the file itself:
        this.processedSrc = this.src;
      }
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from the observable to prevent memory leaks
    if (this.pdfSubscription) {
      this.pdfSubscription.unsubscribe();
    }
  }
}
