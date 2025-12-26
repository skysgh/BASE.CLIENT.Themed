// Ag:
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
// Etc:
//
// Configuration:
import { appsConfiguration } from "../../../../apps/configuration/implementations/apps.configuration';
import { themesT1Configuration } from "../../configuration/implementations/themes.t1.configuration";
// Servics:
import { DefaultComponentServices } from "../../../../core/services/default-controller-services";
// Models:
import { SummaryItemVTO } from '../../../../core/models/SummaryItem.vto.model';
import { ViewModel } from "./vm";
// Data:
//

@Component({
  selector: 'app-base-core-common-components-summaryitem',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentsSummaryItemComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

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
  constructor(private defaultControllerServices: DefaultComponentServices) {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
  }


  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.onInit()`);
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
