import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SummaryItemVTO } from "../../../../shared/models/SummaryItemVTO.model";
import { DiagnosticsTraceService } from "../../../../shared/services/diagnostics.service";


@Component({
  selector: 'app-base-core-common-components-summaryitem',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentsSummaryItemComponent implements OnInit {

  /**
   * The exposed property to provide a SummaryItem
   * in a template:
   */
  @Input() summaryItem?: SummaryItemVTO = undefined;

  @Output() clicked = new EventEmitter<SummaryItemVTO>();

  /**
   *  The operation button clicked
   * If in a wrapping selector, will bubble up.
  */
  @Output() operationClicked = new EventEmitter<
    { summaryItem: SummaryItemVTO | undefined, action: string }>();

  /**
   * Constructor
   * @param diagnosticTraceService
   */
  constructor(private diagnosticTraceService: DiagnosticsTraceService) {
    this.diagnosticTraceService.debug(`${this.constructor.name}.construtor()`);
  }


  ngOnInit(): void {
    this.diagnosticTraceService.debug(`${this.constructor.name}.onInit()`);
  }



  /**
   * an operation has been clicked:
   */
  onOperationClick(action: string) {
    var info = {
      summaryItem : this.summaryItem,
      action : action
    };
    // Handle operation click logic
    this.operationClicked.emit(info);

  //  this.summaryItem?.operations?.forEach(operation => {
  //    if (operation.action === action) {
  //      //TODO: where did this come from?
  //      operation.handler(this.item);
  //      return;
  //    }
  //  });
  }
}
