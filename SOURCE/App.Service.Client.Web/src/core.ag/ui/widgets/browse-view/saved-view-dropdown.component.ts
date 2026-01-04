/**
 * Saved View Dropdown Component
 * 
 * Dropdown for selecting saved views in BrowseView.
 * Shows:
 * - Current view indicator
 * - User's saved views
 * - Option to save current view
 * - MRU view (if different from current)
 * 
 * Part of the BrowseView widget family.
 */
import { 
  Component, 
  Input, 
  Output, 
  EventEmitter,
  inject,
  signal,
  computed,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SavedView, getViewSummary } from '../../../../core/models/view/saved-view.model';
import { SavedViewService } from '../../../../core/services/saved-view.service';

@Component({
  selector: 'app-saved-view-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDropdownModule],
  template: `
    <div class="saved-view-dropdown" ngbDropdown>
      <button 
        type="button" 
        class="btn btn-soft-secondary btn-sm d-flex align-items-center gap-2"
        ngbDropdownToggle>
        <i [class]="currentView?.icon || 'bx bx-filter-alt'"></i>
        <span class="d-none d-md-inline">{{ currentView?.title || 'Views' }}</span>
        <i class="bx bx-chevron-down ms-1"></i>
      </button>
      
      <div ngbDropdownMenu class="dropdown-menu-end saved-view-menu">
        <!-- Header -->
        <h6 class="dropdown-header d-flex align-items-center justify-content-between">
          <span>Saved Views</span>
          @if (hasUnsavedChanges()) {
            <span class="badge bg-warning-subtle text-warning">Unsaved</span>
          }
        </h6>
        
        <!-- Default View -->
        @if (defaultView(); as view) {
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
        
        <!-- MRU View (if exists and not current) -->
        @if (mruView(); as view) {
          @if (!isActive(view)) {
            <button 
              class="dropdown-item d-flex align-items-center gap-2"
              (click)="selectView(view)">
              <i class="bx bx-history text-info"></i>
              <div class="flex-grow-1">
                <div>{{ view.title }}</div>
                <small class="text-muted">{{ getViewSummary(view) }}</small>
              </div>
            </button>
          }
        }
        
        <!-- Divider if user views exist -->
        @if (userViews().length > 0) {
          <div class="dropdown-divider"></div>
        }
        
        <!-- User Saved Views -->
        @for (view of userViews(); track view.id) {
          <div class="dropdown-item d-flex align-items-center gap-2 pe-2">
            <button 
              class="btn btn-link p-0 text-start flex-grow-1 d-flex align-items-center gap-2"
              [class.fw-bold]="isActive(view)"
              (click)="selectView(view)">
              <i [class]="view.icon || 'bx bx-filter-alt'"></i>
              <div class="flex-grow-1 text-truncate">
                <div class="text-truncate">{{ view.title }}</div>
                @if (view.description) {
                  <small class="text-muted text-truncate d-block">{{ view.description }}</small>
                }
              </div>
              @if (isActive(view)) {
                <i class="bx bx-check text-success flex-shrink-0"></i>
              }
            </button>
            <button 
              class="btn btn-sm btn-ghost-danger p-1"
              title="Delete view"
              (click)="deleteView(view, $event)">
              <i class="bx bx-trash-alt"></i>
            </button>
          </div>
        }
        
        <!-- Save Current View -->
        <div class="dropdown-divider"></div>
        
        @if (showSaveForm()) {
          <!-- Save Form -->
          <div class="px-3 py-2">
            <div class="mb-2">
              <input 
                type="text" 
                class="form-control form-control-sm"
                placeholder="View name..."
                [(ngModel)]="newViewTitle"
                (keyup.enter)="saveCurrentView()"
                #saveInput>
            </div>
            <div class="d-flex gap-2">
              <button 
                class="btn btn-primary btn-sm flex-grow-1"
                [disabled]="!newViewTitle.trim()"
                (click)="saveCurrentView()">
                Save
              </button>
              <button 
                class="btn btn-light btn-sm"
                (click)="cancelSave()">
                Cancel
              </button>
            </div>
          </div>
        } @else {
          <button 
            class="dropdown-item d-flex align-items-center gap-2 text-primary"
            (click)="startSave()">
            <i class="bx bx-plus"></i>
            <span>Save Current View</span>
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .saved-view-menu {
      min-width: 280px;
      max-width: 320px;
    }
    
    .dropdown-item {
      padding: 0.5rem 1rem;
      
      &.active {
        background-color: rgba(var(--vz-primary-rgb), 0.1);
      }
      
      .btn-link {
        color: inherit;
        text-decoration: none;
        
        &:hover {
          color: var(--vz-primary);
        }
      }
    }
    
    .btn-ghost-danger {
      color: var(--vz-danger);
      opacity: 0.5;
      transition: opacity 0.2s;
      
      &:hover {
        opacity: 1;
        background: rgba(var(--vz-danger-rgb), 0.1);
      }
    }
  `]
})
export class SavedViewDropdownComponent implements OnInit {
  private savedViewService = inject(SavedViewService);
  
  /** Entity type for views (e.g., 'spike') */
  @Input({ required: true }) entityType!: string;
  
  /** Current URL params to compare against saved views */
  @Input() currentParams: Record<string, string> = {};
  
  /** Emitted when a view is selected */
  @Output() viewSelect = new EventEmitter<SavedView>();
  
  /** Emitted when save is requested with current params */
  @Output() saveRequest = new EventEmitter<{ title: string; params: Record<string, string> }>();
  
  // Local state
  showSaveForm = signal(false);
  newViewTitle = '';
  
  // Computed from service
  allViews = computed(() => this.savedViewService.getViews(this.entityType));
  defaultView = computed(() => this.savedViewService.getDefaultView(this.entityType));
  mruView = computed(() => this.savedViewService.getMruView(this.entityType));
  userViews = computed(() => this.savedViewService.getUserViews(this.entityType));
  
  // Current view detection
  currentView = computed(() => {
    return this.savedViewService.findMatchingView(this.entityType, this.currentParams);
  });
  
  ngOnInit(): void {
    // Initialize entity if needed
    this.savedViewService.initializeEntity(this.entityType);
  }
  
  isActive(view: SavedView): boolean {
    const current = this.currentView();
    return current?.id === view.id;
  }
  
  hasUnsavedChanges(): boolean {
    // If we have params but no matching view, it's unsaved
    const hasParams = Object.keys(this.currentParams).filter(k => this.currentParams[k]).length > 0;
    return hasParams && !this.currentView();
  }
  
  selectView(view: SavedView): void {
    this.viewSelect.emit(view);
  }
  
  startSave(): void {
    this.showSaveForm.set(true);
    this.newViewTitle = '';
  }
  
  cancelSave(): void {
    this.showSaveForm.set(false);
    this.newViewTitle = '';
  }
  
  saveCurrentView(): void {
    if (!this.newViewTitle.trim()) return;
    
    const view = this.savedViewService.createView({
      title: this.newViewTitle.trim(),
      entityType: this.entityType,
      urlParams: { ...this.currentParams },
    });
    
    this.showSaveForm.set(false);
    this.newViewTitle = '';
    
    // Emit for parent to handle any additional logic
    this.saveRequest.emit({
      title: view.title,
      params: view.urlParams,
    });
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
