/**
 * Drill-Down Selector Component
 * 
 * A rich dropdown replacement that supports:
 * - Universal Card display for options
 * - Search/filter with pagination
 * - Single or multi-select
 * - Desktop (popover) and Mobile (full-view) responsive modes
 * - Enabled/disabled items with explanations
 * 
 * ARCHITECTURE:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ DRILL-DOWN SELECTOR                                             │
 * │                                                                 │
 * │ ┌─────────────────────────────────────────────────────────────┐ │
 * │ │ SELECTION SUMMARY (always visible)                         │ │
 * │ │ [Selected Item 1] [Item 2] [+3 more]                  [▼] │ │
 * │ └─────────────────────────────────────────────────────────────┘ │
 * │                                                                 │
 * │ ┌─────────────────────────────────────────────────────────────┐ │
 * │ │ OPTIONS PANEL (when expanded)                              │ │
 * │ │ ┌───────────────────────────────────────────────────────┐ │ │
 * │ │ │ 🔍 Search...                                         │ │ │
 * │ │ └───────────────────────────────────────────────────────┘ │ │
 * │ │ ┌───────────────────────────────────────────────────────┐ │ │
 * │ │ │ [☑] Option Card 1 (selected)                         │ │ │
 * │ │ │ [☐] Option Card 2                                    │ │ │
 * │ │ │ [☐] Option Card 3 (disabled - struck)                │ │ │
 * │ │ │ ◄ 1 2 3 ►                                            │ │ │
 * │ │ └───────────────────────────────────────────────────────┘ │ │
 * │ │ [Cancel] [Apply]                                          │ │
 * │ └─────────────────────────────────────────────────────────────┘ │
 * └─────────────────────────────────────────────────────────────────┘
 * 
 * INPUTS:
 * - items: IReferenceItem<T>[] - All available options
 * - value: T | T[] - Currently selected value(s)
 * - multi: boolean - Allow multiple selection
 * - searchable: boolean - Show search box
 * - placeholder: string - Placeholder text
 * - disabled: boolean - Disable entire selector
 * - required: boolean - At least one item required
 * - pageSize: number - Items per page in options panel
 * - label: string - Label above selector
 * 
 * OUTPUTS:
 * - valueChange: Emitted when selection changes
 */
import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  signal, 
  computed,
  effect,
  ElementRef,
  HostListener,
  ChangeDetectionStrategy,
  forwardRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { SelectionSummaryComponent } from './selection-summary.component';
import { OptionsPanelComponent } from './options-panel.component';
import { 
  IReferenceItem, 
  SelectionMode,
  findReferenceItem,
  getSelectedItems
} from '../../models/presentation/reference-item.model';

@Component({
  selector: 'app-drill-selector',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    SelectionSummaryComponent,
    OptionsPanelComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DrillSelectorComponent),
      multi: true
    }
  ],
  template: `
    <div 
      class="drill-selector"
      [class.expanded]="isExpanded()"
      [class.disabled]="disabled"
      [class.has-error]="hasError">
      
      <!-- Optional Label -->
      @if (label) {
        <label class="form-label">
          {{label}}
          @if (required) {
            <span class="text-danger">*</span>
          }
        </label>
      }
      
      <!-- Selection Summary (always visible) -->
      <app-selection-summary
        [selectedItems]="selectedItems()"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [expanded]="isExpanded()"
        [multiMode]="multi"
        [maxVisible]="maxVisibleChips"
        (summaryClick)="toggleExpanded()"
        (removeItem)="onRemoveItem($event)">
      </app-selection-summary>
      
      <!-- Options Panel - Desktop Overlay -->
      @if (isExpanded() && !isMobile()) {
        <div class="options-panel-wrapper overlay-mode">
          <app-options-panel
            [items]="items"
            [selectedValues]="selectedValues()"
            [multi]="multi"
            [searchable]="searchable"
            [pageSize]="pageSize"
            [searchPlaceholder]="searchPlaceholder"
            (selectionChange)="onSelectionChange($event)"
            (close)="closePanel()"
            (apply)="onApply()">
          </app-options-panel>
        </div>
        <div class="drill-selector-backdrop" (click)="closePanel()"></div>
      }
      
      <!-- Error Message -->
      @if (hasError && errorMessage) {
        <div class="invalid-feedback d-block">
          {{errorMessage}}
        </div>
      }
    </div>
    
    <!-- Options Panel - Mobile Full Screen Modal -->
    @if (isExpanded() && isMobile()) {
      <div class="mobile-panel-overlay" (click)="closePanel()">
        <div class="mobile-panel-container" (click)="$event.stopPropagation()">
          <div class="mobile-panel-header">
            <h6 class="mb-0">{{label || placeholder}}</h6>
            <button type="button" class="btn-close" (click)="closePanel()"></button>
          </div>
          <div class="mobile-panel-body">
            <app-options-panel
              [items]="items"
              [selectedValues]="selectedValues()"
              [multi]="multi"
              [searchable]="searchable"
              [pageSize]="pageSize"
              [searchPlaceholder]="searchPlaceholder"
              (selectionChange)="onSelectionChange($event)"
              (close)="closePanel()"
              (apply)="onApply()">
            </app-options-panel>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
    }
    
    .drill-selector {
      position: relative;
      
      &.disabled {
        pointer-events: none;
      }
    }
    
    .form-label {
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    /* Desktop Overlay Mode */
    .options-panel-wrapper.overlay-mode {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 1050;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
      border-radius: 0.375rem;
      background: var(--vz-card-bg, #fff);
      border: 1px solid var(--vz-border-color, #e9ebec);
      max-height: 400px;
      overflow: hidden;
      margin-top: 0.25rem;
    }
    
    .drill-selector-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1040;
      background: transparent;
    }
    
    /* Mobile Full Screen Modal */
    .mobile-panel-overlay {
      position: fixed;
      inset: 0;
      z-index: 1055;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: flex-end;
      animation: fadeIn 0.15s ease-out;
    }
    
    .mobile-panel-container {
      width: 100%;
      max-height: 85vh;
      background: var(--vz-card-bg, #fff);
      border-radius: 1rem 1rem 0 0;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.2s ease-out;
    }
    
    .mobile-panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid var(--vz-border-color, #e9ebec);
      flex-shrink: 0;
    }
    
    .mobile-panel-body {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
    
    .invalid-feedback {
      font-size: 0.875em;
      color: var(--vz-danger, #f06548);
    }
  `]
})
export class DrillSelectorComponent<T = unknown> implements ControlValueAccessor {
  // ─────────────────────────────────────────────────────────────────────────
  // INPUTS
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * All available items to select from
   */
  @Input() items: IReferenceItem<T>[] = [];
  
  /**
   * Allow multiple selection
   */
  @Input() multi: boolean = false;
  
  /**
   * Show search box
   */
  @Input() searchable: boolean = true;
  
  /**
   * Placeholder text when nothing selected
   */
  @Input() placeholder: string = 'Select...';
  
  /**
   * Search box placeholder
   */
  @Input() searchPlaceholder: string = 'Search...';
  
  /**
   * Disable entire selector
   */
  @Input() disabled: boolean = false;
  
  /**
   * At least one item required
   */
  @Input() required: boolean = false;
  
  /**
   * Items per page in options panel
   */
  @Input() pageSize: number = 10;
  
  /**
   * Max chips to show before "+N more"
   */
  @Input() maxVisibleChips: number = 3;
  
  /**
   * Label above selector
   */
  @Input() label: string = '';
  
  /**
   * Error message to display
   */
  @Input() errorMessage: string = '';
  
  /**
   * Has validation error
   */
  @Input() hasError: boolean = false;
  
  // ─────────────────────────────────────────────────────────────────────────
  // OUTPUTS
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Emitted when selection changes
   */
  @Output() valueChange = new EventEmitter<T | T[] | null>();
  
  // ─────────────────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────────────────
  
  /** Is panel expanded? */
  isExpanded = signal(false);
  
  /** Is mobile viewport? */
  isMobile = signal(false);
  
  /** Currently selected values */
  selectedValues = signal<T[]>([]);
  
  /** Pending selection (before Apply in multi mode) */
  pendingValues = signal<T[] | null>(null);
  
  /** Selected items (computed from values) */
  selectedItems = computed(() => {
    return getSelectedItems(this.items, this.selectedValues());
  });
  
  // ─────────────────────────────────────────────────────────────────────────
  // CONTROL VALUE ACCESSOR
  // ─────────────────────────────────────────────────────────────────────────
  
  private onChange: (value: T | T[] | null) => void = () => {};
  private onTouched: () => void = () => {};
  
  writeValue(value: T | T[] | null): void {
    if (value === null || value === undefined) {
      this.selectedValues.set([]);
    } else if (Array.isArray(value)) {
      this.selectedValues.set(value);
    } else {
      this.selectedValues.set([value]);
    }
  }
  
  registerOnChange(fn: (value: T | T[] | null) => void): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // LIFECYCLE
  // ─────────────────────────────────────────────────────────────────────────
  
  constructor(private elementRef: ElementRef) {
    // Check viewport on resize
    this.checkViewport();
  }
  
  @HostListener('window:resize')
  onResize(): void {
    this.checkViewport();
  }
  
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isExpanded()) {
      this.closePanel();
    }
  }
  
  private checkViewport(): void {
    // Mobile breakpoint: 768px
    this.isMobile.set(window.innerWidth < 768);
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Toggle panel expansion
   */
  toggleExpanded(): void {
    if (this.disabled) return;
    
    if (this.isExpanded()) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }
  
  /**
   * Open options panel
   */
  openPanel(): void {
    if (this.disabled) return;
    this.isExpanded.set(true);
    this.pendingValues.set([...this.selectedValues()]);
  }
  
  /**
   * Close options panel
   */
  closePanel(): void {
    this.isExpanded.set(false);
    this.pendingValues.set(null);
    this.onTouched();
  }
  
  /**
   * Handle selection change from options panel
   */
  onSelectionChange(values: T[]): void {
    if (this.multi) {
      // Multi mode: update pending, apply on button click
      this.pendingValues.set(values);
    } else {
      // Single mode: apply immediately and close
      this.applySelection(values);
      this.closePanel();
    }
  }
  
  /**
   * Apply pending selection (multi mode)
   */
  onApply(): void {
    const pending = this.pendingValues();
    if (pending !== null) {
      this.applySelection(pending);
    }
    this.closePanel();
  }
  
  /**
   * Remove item from selection (from summary chip X button)
   */
  onRemoveItem(item: IReferenceItem<T>): void {
    const current = this.selectedValues();
    const updated = current.filter(v => v !== item.value);
    this.applySelection(updated);
  }
  
  /**
   * Apply selection and emit change
   */
  private applySelection(values: T[]): void {
    this.selectedValues.set(values);
    
    // Emit appropriate format
    let emitValue: T | T[] | null;
    if (this.multi) {
      emitValue = values;
    } else {
      emitValue = values.length > 0 ? values[0] : null;
    }
    
    this.valueChange.emit(emitValue);
    this.onChange(emitValue);
  }
}
