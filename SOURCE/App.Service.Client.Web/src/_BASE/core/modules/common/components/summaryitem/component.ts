// Ag:
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
// Etc:
//
// Constants:
import { system as importedSystemConst } from '../../../../constants/system';
// Services:
import { SystemDiagnosticsTraceService } from "../../../../services/system.diagnostics-trace.service";
// Models:
import { SummaryItemVTO } from "../../../../models/SummaryItem.vto.model";
// Data:
//

@Component({
  selector: 'app-base-core-common-components-summaryitem',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentsSummaryItemComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

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
   * @param diagnosticsTraceService
   */
  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
  }


  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.onInit()`);
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
