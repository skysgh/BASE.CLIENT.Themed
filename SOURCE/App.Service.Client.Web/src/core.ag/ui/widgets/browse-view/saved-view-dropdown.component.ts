/**
 * Saved View Dropdown Component
 *
 * Dropdown for selecting saved views in BrowseView.
 * Shows:
 * - Current view indicator (MRU or named view)
 * - Saved views list with checkmarks for active
 * - "Customize..." option to open filter/order/display panels
 * - Option to save current customization
 *
 * MRU Flow:
 * - "All Items" is the default (no filters)
 * - "Last Used" appears when user applies filters and navigates away
 * - On return, user can select "Last Used" to restore previous filters
 *
 * Part of the BrowseView widget family.
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { SavedView, getViewSummary } from '../../../../core/models/view/saved-view.model';
import { SavedViewService } from '../../../../core/services/saved-view.service';

@Component({
  selector: 'app-saved-view-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDropdownModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div ngbDropdown class="saved-view-dropdown">
      <button 
        type="button" 
        ngbDropdownToggle 
        class="btn btn-soft-primary btn-sm d-flex align-items-center gap-2">
        <i [class]="currentView?.icon || 'bx bx-filter-alt'"></i>
        <span class="view-name">{{ currentView?.title || 'All Items' }}</span>
        @if (isCustomizing) {
          <span class="badge bg-warning-subtle text-warning ms-1">Editing</span>
        }
        @if (hasUnsavedChanges) {
          <span class="badge bg-info-subtle text-info ms-1">Modified</span>
        }
        <i class="bx bx-chevron-down"></i>
      </button>
      
      <div ngbDropdownMenu class="saved-view-menu">
        <!-- Default View (All Items) -->
        @if (defaultView; as view) {
          <button 
            class="dropdown-item d-flex align-items-center gap-2"
            [class.active]="isActive(view)"
            (click)="selectView(view)">
            <i [class]="view.icon || 'bx bx-list-ul'"></i>
            <span class="flex-grow-1">{{ view.title }}</span>
            @if (isActive(view)) {
              <i class="bx bx-check text-success"></i>
            }
          </button>
        }
        
        <!-- MRU View (Last Used) - Show prominently if different from current -->
        @if (mruView; as view) {
          @if (!view.isDefault && hasMruDifferentFromCurrent) {
            <button 
              class="dropdown-item d-flex align-items-center gap-2 mru-item"
              [class.active]="isActive(view)"
              (click)="selectView(view)">
              <i class="bx bx-history text-info"></i>
              <div class="flex-grow-1">
                <div class="fw-medium">Last Used</div>
                <small class="text-muted">{{ getViewSummary(view) }}</small>
              </div>
              @if (isActive(view)) {
                <i class="bx bx-check text-success"></i>
              }
            </button>
          }
        }
        
        <!-- User Saved Views -->
        @if (userViews.length > 0) {
          <div class="dropdown-divider"></div>
          <h6 class="dropdown-header small">My Views</h6>
          <div class="user-views-scroll">
            @for (view of userViews; track view.id) {
              <div class="dropdown-item d-flex align-items-center gap-2 pe-2">
                <button 
                  class="btn btn-link p-0 text-start flex-grow-1 d-flex align-items-center gap-2"
                  [class.fw-semibold]="isActive(view)"
                  (click)="selectView(view)">
                  <i [class]="view.icon || 'bx bx-filter-alt'" class="text-primary"></i>
                  <span class="text-truncate view-title">{{ view.title }}</span>
                </button>
                @if (isActive(view)) {
                  <i class="bx bx-check text-success flex-shrink-0"></i>
                }
                <button 
                  class="btn btn-sm btn-ghost-danger p-1"
                  title="Delete view"
                  (click)="deleteView(view, $event)">
                  <i class="bx bx-trash-alt"></i>
                </button>
              </div>
            }
          </div>
        }
        
        <!-- Divider & Customize -->
        <div class="dropdown-divider"></div>
        <button 
          class="dropdown-item d-flex align-items-center gap-2"
          [class.text-primary]="!isCustomizing"
          [class.text-warning]="isCustomizing"
          (click)="onCustomizeClick()">
          <i class="bx"
             [class.bx-edit-alt]="!isCustomizing"
             [class.bx-x]="isCustomizing"></i>
          <span>{{ isCustomizing ? 'Close Customization' : 'Customize View...' }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .saved-view-menu {
      min-width: 260px;
      max-width: 320px;
    }
    
    .view-name {
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .user-views-scroll {
      max-height: 200px; /* ~5 rows */
      overflow-y: auto;
    }
    
    .dropdown-item {
      padding: 0.5rem 1rem;
      
      &.active {
        background-color: rgba(66, 153, 225, 0.15); /* Baby blue */
        color: var(--vz-primary);
      }
      
      &.mru-item {
        background-color: rgba(var(--vz-info-rgb), 0.05);
        border-left: 3px solid var(--vz-info);
        padding-left: calc(1rem - 3px);
      }
      
      .btn-link {
        color: inherit;
        text-decoration: none;
        &:hover { color: var(--vz-primary); }
      }
      
      .view-title {
        max-width: 140px;
      }
    }
    
    .btn-ghost-danger {
      color: var(--vz-danger);
      opacity: 0.4;
      transition: opacity 0.2s;
      
      &:hover {
        opacity: 1;
        background: rgba(var(--vz-danger-rgb), 0.1);
      }
    }
  `]
})
export class SavedViewDropdownComponent {
  private savedViewService = inject(SavedViewService);
  
  /** Entity type for views (e.g., 'spike') */
  @Input({ required: true }) entityType!: string;
  
  /** Current URL params to compare against saved views */
  @Input() currentParams: Record<string, string> = {};
  
  /** Whether customization panels are currently shown */
  @Input() isCustomizing = false;
  
  /** Whether there are unsaved changes */
  @Input() hasUnsavedChanges = false;
  
  /** Emitted when a view is selected */
  @Output() viewSelect = new EventEmitter<SavedView>();
  
  /** Emitted when user wants to customize (expand panels) */
  @Output() customizeToggle = new EventEmitter<boolean>();
  
  // Computed from service
  get allViews(): SavedView[] {
    return this.savedViewService.getViews(this.entityType);
  }
  
  get defaultView(): SavedView | undefined {
    return this.savedViewService.getDefaultView(this.entityType);
  }
  
  get mruView(): SavedView | undefined {
    return this.savedViewService.getMruView(this.entityType);
  }
  
  get userViews(): SavedView[] {
    return this.savedViewService.getUserViews(this.entityType);
  }
  
  get currentView(): SavedView | undefined {
    return this.savedViewService.findMatchingView(this.entityType, this.currentParams)
      || this.mruView
      || this.defaultView;
  }
  
  /**
   * Check if MRU view exists and is different from current URL params
   * This helps users understand when "Last Used" can restore previous state
   */
  get hasMruDifferentFromCurrent(): boolean {
    const mru = this.mruView;
    if (!mru) return false;
    
    // Check if current params differ from MRU params
    const currentKeys = Object.keys(this.currentParams).filter(k => this.currentParams[k]);
    const mruKeys = Object.keys(mru.urlParams).filter(k => mru.urlParams[k]);
    
    // If both empty, they're the same
    if (currentKeys.length === 0 && mruKeys.length === 0) return false;
    
    // If different counts, they differ
    if (currentKeys.length !== mruKeys.length) return true;
    
    // Check each key
    return currentKeys.some(k => this.currentParams[k] !== mru.urlParams[k]);
  }
  
  ngOnInit(): void {
    this.savedViewService.initializeEntity(this.entityType);
  }
  
  isActive(view: SavedView): boolean {
    const matching = this.savedViewService.findMatchingView(this.entityType, this.currentParams);
    return matching?.id === view.id;
  }
  
  selectView(view: SavedView): void {
    this.viewSelect.emit(view);
  }
  
  onCustomizeClick(): void {
    this.customizeToggle.emit(!this.isCustomizing);
  }
  
  deleteView(view: SavedView, event: Event): void {
    event.stopPropagation();
    if (confirm(`Delete view "${view.title}"?`)) {
      this.savedViewService.deleteView(this.entityType, view.id);
    }
  }
  
  getViewSummary(view: SavedView): string {
    return getViewSummary(view);
  }
}
