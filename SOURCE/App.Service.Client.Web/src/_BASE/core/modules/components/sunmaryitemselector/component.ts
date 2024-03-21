import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SummaryItemVTO } from '../../../../shared/models/SummaryItemVTO.model';

@Component({
  selector: 'app-base-common-components-summaryitem-selector',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseComponentsSummaryItemSelectorComponent {

  
  @Input() // Adjust the duration as needed
  public pressDuration :number = 600;

  private pressTimer: any;

  @Input() public items: SummaryItemVTO[] = [];

  // The list of selected items:
  public selectedItems: SummaryItemVTO[] = [];

  //Events raised:
  @Output() itemSelected = new EventEmitter<SummaryItemVTO>();
  @Output() multipleItemsSelected = new EventEmitter<SummaryItemVTO[]>();
  @Output() operationClicked = new EventEmitter<{ item: SummaryItemVTO, operation: string }>();

  // Handle item selection
  public selectItem(item: SummaryItemVTO) {
    this.itemSelected.emit(item);
  }

  // Start timer on mouse down
  public startPressTimer(item: SummaryItemVTO) {
    this.pressTimer = setTimeout(() => {
      this.selectMultipleItems(item);
    }, this.pressDuration); 
  }

  // Clear timer on mouse up or mouse leave
  public clearPressTimer() {
    clearTimeout(this.pressTimer);
  }

  // Handle multiple item selection by holding down
  public selectMultipleItems(item: SummaryItemVTO) {
    // add or remove item from array:
    if (this.selectedItems.includes(item)) {
      this.selectedItems = this.selectedItems.filter(selectedItem => selectedItem !== item);
    } else {
      this.selectedItems.push(item);
    }
    // And raise event:
    this.multipleItemsSelected.emit(this.selectedItems);
  }

  // Handle operation click
  onOperationClick(event: MouseEvent, item: SummaryItemVTO, operation: string) {
    event.stopPropagation(); // Prevent event bubbling
    this.operationClicked.emit({ item, operation });
  }


}
