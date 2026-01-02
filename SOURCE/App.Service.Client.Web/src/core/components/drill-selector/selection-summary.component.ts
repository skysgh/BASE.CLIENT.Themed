/**
 * Selection Summary Component
 * 
 * Displays a compact summary of selected items from a Drill-Down Selector.
 * 
 * DISPLAY MODES:
 * - Empty: Shows placeholder text
 * - Single: Shows the selected item's card (compact form)
 * - Multi: Shows chips/pills for selected items + "+N more" overflow
 * 
 * ARCHITECTURE:
 * This is the "closed" state of a dropdown - what users see before clicking.
 * When clicked, the full options panel opens (handled by parent drill-selector).
 * 
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ SELECTION SUMMARY (always visible)                             │
 * │                                                                 │
 * │ Empty:     [Select an item...]                           [▼]   │
 * │ Single:    [🎯 United States - North America]           [▼]   │
 * │ Multi:     [USA] [Canada] [+3 more]                      [▼]   │
 * └─────────────────────────────────────────────────────────────────┘
 * 
 * INPUTS:
 * - selectedItems: The currently selected IReferenceItem[]
 * - placeholder: Text when nothing selected
 * - maxVisible: Max chips to show before "+N more"
 * - disabled: Prevent interaction
 * - expanded: Current expansion state (for arrow direction)
 * 
 * OUTPUTS:
 * - click: Emitted when user clicks to expand/collapse
 * - removeItem: Emitted when user clicks X on a chip (multi mode)
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IReferenceItem } from '../../models/presentation/reference-item.model';

@Component({
  selector: 'app-selection-summary',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div 
      class="selection-summary"
      [class.disabled]="disabled"
      [class.expanded]="expanded"
      [class.has-selection]="selectedItems.length > 0"
      (click)="onClick($event)">
      
      <!-- Empty State -->
      @if (selectedItems.length === 0) {
        <div class="summary-placeholder">
          <span class="placeholder-text">{{placeholder}}</span>
        </div>
      }
      
      <!-- Single Selection -->
      @if (selectedItems.length === 1 && !multiMode) {
        <div class="summary-single">
          @if (selectedItems[0].card.icon) {
            <i [class]="selectedItems[0].card.icon + ' me-2'"></i>
          }
          <span class="item-title">{{selectedItems[0].card.title}}</span>
          @if (selectedItems[0].card.subtitle) {
            <span class="item-subtitle text-muted ms-2">{{selectedItems[0].card.subtitle}}</span>
          }
        </div>
      }
      
      <!-- Multi Selection -->
      @if (selectedItems.length > 0 && multiMode) {
        <div class="summary-multi">
          @for (item of visibleItems; track item.value) {
            <span class="selection-chip" [class]="getChipClass(item)">
              @if (item.card.icon) {
                <i [class]="item.card.icon + ' me-1'"></i>
              }
              <span class="chip-text">{{item.card.title}}</span>
              @if (!disabled) {
                <button 
                  type="button" 
                  class="chip-remove"
                  (click)="onRemoveItem($event, item)"
                  aria-label="Remove">
                  <i class="bx bx-x"></i>
                </button>
              }
            </span>
          }
          @if (overflowCount > 0) {
            <span class="selection-chip overflow-chip">
              +{{overflowCount}} more
            </span>
          }
        </div>
      }
      
      <!-- Expand/Collapse Arrow -->
      <div class="summary-arrow">
        <i class="bx" [class.bx-chevron-down]="!expanded" [class.bx-chevron-up]="expanded"></i>
      </div>
    </div>
  `,
  styles: [`
    .selection-summary {
      display: flex;
      align-items: center;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--vz-border-color, #e9ebec);
      border-radius: 0.25rem;
      background: var(--vz-input-bg, #fff);
      cursor: pointer;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      min-height: 38px;
      
      &:hover:not(.disabled) {
        border-color: var(--vz-primary, #405189);
      }
      
      &:focus-within:not(.disabled) {
        border-color: var(--vz-primary, #405189);
        box-shadow: 0 0 0 0.25rem rgba(64, 81, 137, 0.25);
      }
      
      &.disabled {
        background: var(--vz-input-disabled-bg, #eff2f7);
        cursor: not-allowed;
        opacity: 0.65;
      }
      
      &.expanded {
        border-color: var(--vz-primary, #405189);
      }
    }
    
    .summary-placeholder {
      flex: 1;
      
      .placeholder-text {
        color: var(--vz-secondary-color, #878a99);
      }
    }
    
    .summary-single {
      flex: 1;
      display: flex;
      align-items: center;
      overflow: hidden;
      
      .item-title {
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .item-subtitle {
        font-size: 0.875em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    
    .summary-multi {
      flex: 1;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.25rem;
      overflow: hidden;
    }
    
    .selection-chip {
      display: inline-flex;
      align-items: center;
      padding: 0.125rem 0.5rem;
      background: var(--vz-primary-bg-subtle, #d3d8eb);
      color: var(--vz-primary, #405189);
      border-radius: 0.25rem;
      font-size: 0.8125rem;
      max-width: 150px;
      
      .chip-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .chip-remove {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-left: 0.25rem;
        padding: 0;
        border: none;
        background: transparent;
        color: inherit;
        cursor: pointer;
        opacity: 0.7;
        
        &:hover {
          opacity: 1;
        }
      }
      
      &.overflow-chip {
        background: var(--vz-secondary-bg-subtle, #e9ebec);
        color: var(--vz-secondary-color, #878a99);
      }
    }
    
    .summary-arrow {
      margin-left: 0.5rem;
      color: var(--vz-secondary-color, #878a99);
      
      i {
        font-size: 1.25rem;
      }
    }
  `]
})
export class SelectionSummaryComponent<T = unknown> {
  /**
   * Currently selected items
   */
  @Input() selectedItems: IReferenceItem<T>[] = [];
  
  /**
   * Placeholder text when nothing selected
   */
  @Input() placeholder: string = 'Select...';
  
  /**
   * Maximum visible chips before showing "+N more"
   */
  @Input() maxVisible: number = 3;
  
  /**
   * Is selector disabled?
   */
  @Input() disabled: boolean = false;
  
  /**
   * Is options panel expanded?
   */
  @Input() expanded: boolean = false;
  
  /**
   * Force multi-mode display (chips instead of single card)
   */
  @Input() multiMode: boolean = false;
  
  /**
   * Emitted when summary is clicked
   */
  @Output() summaryClick = new EventEmitter<void>();
  
  /**
   * Emitted when remove button clicked on a chip
   */
  @Output() removeItem = new EventEmitter<IReferenceItem<T>>();
  
  /**
   * Get visible items (respecting maxVisible)
   */
  get visibleItems(): IReferenceItem<T>[] {
    return this.selectedItems.slice(0, this.maxVisible);
  }
  
  /**
   * Get overflow count
   */
  get overflowCount(): number {
    return Math.max(0, this.selectedItems.length - this.maxVisible);
  }
  
  /**
   * Handle click on summary
   */
  onClick(event: Event): void {
    if (this.disabled) return;
    event.stopPropagation();
    this.summaryClick.emit();
  }
  
  /**
   * Handle remove click on a chip
   */
  onRemoveItem(event: Event, item: IReferenceItem<T>): void {
    event.stopPropagation();
    if (this.disabled) return;
    this.removeItem.emit(item);
  }
  
  /**
   * Get CSS class for chip based on item status
   */
  getChipClass(item: IReferenceItem<T>): string {
    if (item.card.status) {
      return `bg-${item.card.status.variant}-subtle text-${item.card.status.variant}`;
    }
    return '';
  }
}
