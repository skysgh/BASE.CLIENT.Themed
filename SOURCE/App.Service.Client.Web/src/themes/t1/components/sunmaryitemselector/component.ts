// Rx:
//
// Ag:
import { Component, Input, Output, EventEmitter } from '@angular/core';
// Configuration:
import { themesT1Configuration } from '../../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../../core/services/default-controller-services';
// Models:
import { SummaryItemVTO } from '../../../../core/models/SummaryItem.vto.model';
import { ViewModel } from './vm';
// Data:
//

@Component({
    selector: 'app-base-common-components-summaryitem-selector',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})

/**
 * Summary Item Selector Component
 * 
 * ✅ ARCHITECTURAL FIX - Removed Upward Coupling
 * Removed direct appsConfiguration import (upward coupling to Apps tier)
 * Component now only references themesT1Configuration (same tier)
 */
export class BaseCoreCommonComponentsSummaryItemSelectorComponent {
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

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
  constructor(private defaultControllerServices: DefaultComponentServices) {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
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
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.selectItem(item)`);
    //works:

    if (this.selectedItems.includes(item)) {
      this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.selectMultipleItems.REMOVE(item)`);
      this.selectedItems = [];
    } else {
      this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.selectMultipleItems.ADD(item)`);
      this.selectedItems = [item];
    }

    this.itemSelected.emit(item);
  }

  public onDoubleClick(item: SummaryItemVTO, event: MouseEvent) {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.onDoubleClick(item)`);
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
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.startPressTimer(item)`);
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
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.clearPressTimer(item)`);
    clearTimeout(this.pressTimer);
    //No...best it doesn't stop it: event.stopPropagation();
  }

  // Handle multiple item selection by holding down
  public selectMultipleItems(item: SummaryItemVTO) {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.selectMultipleItems(item)`);
    // add or remove item from array:
    if (this.selectedItems.includes(item)) {
      this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.selectMultipleItems.REMOVE(item)`);
      this.selectedItems = this.selectedItems.filter(selectedItem => selectedItem !== item);
    } else {
      this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.selectMultipleItems.ADD(item)`);
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
