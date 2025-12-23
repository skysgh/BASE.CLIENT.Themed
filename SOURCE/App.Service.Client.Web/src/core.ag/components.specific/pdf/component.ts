// Rx:
import { Subscription } from "rxjs";
// Ag:
import { Component, Input, OnDestroy, OnInit, Output } from "@angular/core";
// Etc:
//import { MarkdownService } from 'ngx-markdown';
// Constants:
//
// Services:
import { SystemDiagnosticsTraceService } from "../../../core/services/system.diagnostics-trace.service";
import { PdfService } from "../../../core/services/infrastructure/pdf.service";

import { ViewModel } from "./vm";
import { SystemDefaultServices } from "../../../core/services/system.default-services.service";
import { appsConfiguration } from "../../../apps/configuration/implementations/apps.configuration";
import { coreAgConfiguration } from "../../configuration/implementations/coreAg.configuration";
import { DefaultComponentServices } from "../../../core/services/default-controller-services";
// Models:
//
// Data:
//

/**
 * A component to render a PDF page.
 *
 * It's just a wrapper, as its key purpose
 * is to isolate the rest of the app
 * from a direct dependency on a 3rd party library.
 *
 * Note:
 * An example use case is the rendering
 * Terms & Conditions, Privacy Policies, etc.
 * that business stakeholders are unable or
 * unwillling to convert to markdown.
 *
 * Note:
 * remember that PDFs are Print artefacts before
 * being Web artefacts, so sizing, display, etc.
 * can be a bit tricky.
 */
/**
 * See: https://www.npmjs.com/package/ng2-pdf-viewer
 */
@Component({
  selector: 'app-base-core-common-components-pdf',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentsPdfComponent implements OnInit, OnDestroy {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = coreAgConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

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

  /**
   * Constructor
   * @param diagnosticsTraceService
   * @param pdfService
   */
  constructor(
    private defaultControllerServices : DefaultComponentServices,
    private pdfService: PdfService) {

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);

    // Too early to pick up bound src.
  }


  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.onInit()`);
    this.doWork();
  }

  /**
   *  Fetch and render the target artefact.
   * @returns
   */
  private doWork() {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.doWork(...)`)

    if (!this.src) {
      return;
    }

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.doWork(...)...has src: ${this.src}`)

    if (this.replacements) {
      this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.doWork(...)...has replacements: ${this.replacements}`)
      this.pdfSubscription =
        this.pdfService.fetchAndReplacePdfTokens(this.src, this.replacements, true)
          .subscribe(url => {
            this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.doWork(...)...returned...`)
            // will be something like:
            // blob:http://localhost:4200/16f2f67c-6bba-430b-af75-a99e54b45b55
            this.processedSrc = url;
          });
    } else {
      //just make it the same
      // and let it get the file itself:
      this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.doWork(...)...no tokens...`)
      this.processedSrc = this.src;
    }
  }

  /**
   * Clean up.
   */
  ngOnDestroy(): void {
    // Unsubscribe from the observable to prevent memory leaks
    if (this.pdfSubscription) {
      this.pdfSubscription.unsubscribe();
    }
  }
}
