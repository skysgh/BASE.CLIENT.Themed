// Rx:
//
// Ag:
import { Component, Input, Output, EventEmitter } from '@angular/core';
// Constants:
import { system as importedSystemConst } from '../../../../constants/system';
// Services:
import { SystemDiagnosticsTraceService } from '../../../../services/system.diagnostics-trace.service';
// Models:
import { SummaryItemVTO } from '../../../../models/SummaryItem.vto.model';
import { ViewModel } from './vm';
// Data:
//
@Component({
  selector: 'app-base-common-components-summaryitem-selector',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentsSummaryItemSelectorComponent {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  
  @Input() // Adjust the duration as needed
  public pressDuration :number = 600;

  private pressTimer: any;
  private mouseUpOccurred: boolean = false;

  @Input() public items: SummaryItemVTO[] = [];

  // The list of selected items:
  public selectedItems: SummaryItemVTO[] = [];

  /**
   * Events raised by selectItem event handler.
   */
  @Output() itemSelected = new EventEmitter<SummaryItemVTO>();

  @Output() multipleItemsSelected = new EventEmitter<SummaryItemVTO[]>();
  /**
   * When standalone it is handled by the component.
   * When wrapped in this selector,would be handled as a general case here.
   */
  @Output() operationClicked = new EventEmitter<{ item: SummaryItemVTO, operation: string }>();


  /** Constructor
   * @param diagnosticsTraceService
   */
  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
  }

  /**
   * Handle click event on individual summaryItem elements:
   * @param item
   */
  public selectItem(item: SummaryItemVTO, event: MouseEvent) {
    if (this.mouseUpOccurred) {
      this.mouseUpOccurred = false;
      return;
    }
    this.diagnosticsTraceService.debug(`${this.constructor.name}.selectItem(item)`);
    //works:

    if (this.selectedItems.includes(item)) {
      this.diagnosticsTraceService.debug(`${this.constructor.name}.selectMultipleItems.REMOVE(item)`);
      this.selectedItems = [];
    } else {
      this.diagnosticsTraceService.debug(`${this.constructor.name}.selectMultipleItems.ADD(item)`);
      this.selectedItems = [item];
    }

    this.itemSelected.emit(item);
  }

  public onDoubleClick(item: SummaryItemVTO, event: MouseEvent) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.onDoubleClick(item)`);
    if (event.ctrlKey) {
      this.selectMultipleItems(item);
    } else {
      this.selectedItems = [item];
    }

  }

  /**
   * Handle MouseDown event on summaryItems
   * Starts a timer, that wraps into it a reference to the source item.
   * @param item
   */
  public startPressTimer(item: SummaryItemVTO, event: MouseEvent) {
    if (event.ctrlKey) {
      this.selectMultipleItems(item);
      return;
    }
    this.diagnosticsTraceService.debug(`${this.constructor.name}.startPressTimer(item)`);
    this.pressTimer = setTimeout(() => {
      // timer expires, while not cleared, so trigger handler:
      this.selectMultipleItems(item);
    }, this.pressDuration); 
  }

  /**
   * Handle MouseUp/Leave event on summaryItem
   * Clears the timer.
   * @param event
   */
  public clearPressTimer(event:MouseEvent) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.clearPressTimer(item)`);
    clearTimeout(this.pressTimer);
    //No...best it doesn't stop it: event.stopPropagation();
  }

  // Handle multiple item selection by holding down
  public selectMultipleItems(item: SummaryItemVTO) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.selectMultipleItems(item)`);
    // add or remove item from array:
    if (this.selectedItems.includes(item)) {
      this.diagnosticsTraceService.debug(`${this.constructor.name}.selectMultipleItems.REMOVE(item)`);
      this.selectedItems = this.selectedItems.filter(selectedItem => selectedItem !== item);
    } else {
      this.diagnosticsTraceService.debug(`${this.constructor.name}.selectMultipleItems.ADD(item)`);
      this.selectedItems.push(item);
    }
    this.mouseUpOccurred = true;
    // And raise event:
    this.multipleItemsSelected.emit(this.selectedItems);
  }

  // Handle operation click
  onOperationClick(event: MouseEvent, item: SummaryItemVTO, operation: string) {
    //event.stopPropagation(); // Prevent event bubbling
    this.operationClicked.emit({ item, operation });

    
  }


}
