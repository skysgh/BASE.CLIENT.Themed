/**
 * Browse Actions Bar Component
 * 
 * Displays batch actions that can be applied to selected items.
 * Shows item count, selection info, and action buttons.
 * 
 * Actions have minimum selection requirements:
 * - alwaysVisible=true: Always shown (e.g., Add)
 * - minSelection=1: Only shown when items selected (e.g., Delete)
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BatchAction, BatchActionEvent } from '../../../../core/models/query/batch-action.model';

@Component({
  selector: 'app-browse-actions-bar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="browse-actions-bar">
      <div class="d-flex align-items-center justify-content-between">
        <!-- Left: Count + Selection Info -->
        <div class="d-flex align-items-center gap-3">
          <!-- Item Count -->
          <span class="text-muted small">
            {{ totalCount }} {{ totalCount === 1 ? 'item' : 'items' }}
            @if (selectedCount > 0) {
              <span class="ms-1 text-primary fw-medium">
                ({{ selectedCount }} selected)
              </span>
            }
            @if (paginationInfo) {
              <span class="ms-2">• {{ paginationInfo }}</span>
            }
          </span>
          
          <!-- Clear Selection Button -->
          @if (selectedCount > 0) {
            <button 
              type="button" 
              class="btn btn-sm btn-outline-secondary"
              (click)="onClearSelection()"
              title="Clear selection">
              <i class="bx bx-x"></i>
            </button>
          }
        </div>
        
        <!-- Right: Action Buttons -->
        <div class="d-flex align-items-center gap-2">
          @for (action of visibleActions; track action.id) {
            <button 
              type="button" 
              class="btn btn-sm"
              [class]="getButtonClass(action)"
              [disabled]="!isActionEnabled(action)"
              [title]="getActionTooltip(action)"
              (click)="onActionClick(action)">
              <i [class]="action.icon + ' me-1'"></i>
              {{ action.label }}
              @if (selectedCount > 0 && !action.alwaysVisible) {
                <span class="badge bg-light text-dark ms-1">{{ selectedCount }}</span>
              }
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .browse-actions-bar {
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--vz-border-color);
      margin-bottom: 0.75rem;
    }
    
    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.8125rem;
    }
  `]
})
export class BrowseActionsBarComponent {
  @Input() totalCount = 0;
  @Input() selectedCount = 0;
  @Input() paginationInfo = '';
  @Input() actions: BatchAction[] = [];
  
  @Output() actionClick = new EventEmitter<BatchActionEvent>();
  @Output() clearSelection = new EventEmitter<void>();
  
  /**
   * Get actions that should be visible based on selection state
   */
  get visibleActions(): BatchAction[] {
    return this.actions.filter(action => {
      // Always visible actions show regardless of selection
      if (action.alwaysVisible) return true;
      
      // Other actions only show when there's a selection
      return this.selectedCount > 0;
    });
  }
  
  /**
   * Check if an action is enabled based on selection count
   */
  isActionEnabled(action: BatchAction): boolean {
    if (action.disabled) return false;
    
    // Always visible actions with min=0 are always enabled
    if (action.alwaysVisible && (action.minSelection ?? 0) === 0) {
      return true;
    }
    
    // Check minimum selection
    const min = action.minSelection ?? 1;
    if (this.selectedCount < min) return false;
    
    // Check maximum selection (0 = unlimited)
    const max = action.maxSelection ?? 0;
    if (max > 0 && this.selectedCount > max) return false;
    
    return true;
  }
  
  /**
   * Get tooltip for disabled actions
   */
  getActionTooltip(action: BatchAction): string {
    if (!this.isActionEnabled(action)) {
      if (action.disabledReason) return action.disabledReason;
      
      const min = action.minSelection ?? 1;
      if (this.selectedCount < min) {
        return `Select at least ${min} item(s)`;
      }
      
      const max = action.maxSelection ?? 0;
      if (max > 0 && this.selectedCount > max) {
        return `Select at most ${max} item(s)`;
      }
    }
    return action.label;
  }
  
  /**
   * Get button CSS class based on action variant
   */
  getButtonClass(action: BatchAction): string {
    const variant = action.variant || 'secondary';
    
    // Primary actions get solid buttons
    if (variant === 'primary') {
      return 'btn-primary';
    }
    
    // Danger actions get outline when not enough selected
    if (variant === 'danger') {
      return this.isActionEnabled(action) ? 'btn-danger' : 'btn-outline-danger';
    }
    
    // Default: outline
    return `btn-outline-${variant}`;
  }
  
  /**
   * Handle action button click
   */
  onActionClick(action: BatchAction): void {
    if (!this.isActionEnabled(action)) return;
    
    // TODO: Handle confirmation if required
    // For now, emit directly
    this.actionClick.emit({
      action,
      selectedIds: [], // Will be filled by parent
    });
  }
  
  /**
   * Handle clear selection
   */
  onClearSelection(): void {
    this.clearSelection.emit();
  }
}
