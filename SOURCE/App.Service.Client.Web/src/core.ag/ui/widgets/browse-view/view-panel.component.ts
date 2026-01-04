/**
 * View Panel Component
 * 
 * Displays either list of views OR view editor (full width panel).
 * Mode is controlled by parent via input/output.
 * 
 * List mode: Shows saved views with edit/delete buttons
 * Edit mode: Shows title, filter, sort, display controls
 * 
 * UX Features:
 * - Checkmark on selected/active view
 * - Baby blue highlight on selected row
 * - Scrollable list capped at 5 rows max
 * - "Apply" for ad-hoc changes (not saved)
 * - "Save" for persisting named views
 */
import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SavedView, getViewSummary } from '../../../../core/models/view/saved-view.model';
import { SavedViewService } from '../../../../core/services/saved-view.service';
import { FilterCriteria, SortCriteria, FieldDefinition } from '../../../../core/models/query/query-criteria.model';
import { ChartDefinition } from '../../../../core/models/query/chart-definition.model';
import { ViewMode } from './browse-view-schema.model';

export type ViewPanelMode = 'collapsed' | 'list' | 'edit';

@Component({
  selector: 'app-view-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- LIST MODE -->
    @if (mode === 'list') {
      <div class="view-panel view-list">
        <div class="view-list-scroll">
          @for (view of savedViews; track view.id) {
            <div class="view-list-item d-flex align-items-center gap-2"
                 [class.active]="isActiveView(view)"
                 (click)="selectView(view)">
              <!-- View type icon -->
              <i [class]="getViewIcon(view)" class="view-icon"></i>
              
              <!-- View title -->
              <span class="view-title flex-grow-1 text-truncate"
                    [class.fw-semibold]="isActiveView(view)">
                {{ view.title }}
              </span>
              
              <!-- Summary -->
              <span class="view-summary text-muted small flex-shrink-0">
                {{ getViewSummary(view) }}
              </span>
              
              <!-- Checkmark for selected -->
              @if (isActiveView(view)) {
                <i class="bx bx-check text-primary fs-5"></i>
              }
              
              <!-- Edit button (not for default) -->
              @if (!view.isDefault && !isActiveView(view)) {
                <button 
                  class="btn btn-sm btn-link text-muted p-0 action-btn"
                  title="Edit"
                  (click)="editView(view); $event.stopPropagation()">
                  <i class="bx bx-edit-alt"></i>
                </button>
              }
              
              <!-- Delete button (not for default or MRU) -->
              @if (!view.isDefault && !view.isMru) {
                <button 
                  class="btn btn-sm btn-link text-danger p-0 action-btn"
                  title="Delete"
                  (click)="deleteView(view); $event.stopPropagation()">
                  <i class="bx bx-trash-alt"></i>
                </button>
              }
            </div>
          }
        </div>
        
        <!-- Actions -->
        <div class="mt-2 pt-2 border-top d-flex justify-content-between align-items-center">
          <span class="text-muted small">{{ savedViews.length }} view(s)</span>
          <button 
            class="btn btn-sm btn-outline-primary"
            (click)="startNewView()">
            <i class="bx bx-plus me-1"></i>
            New View
          </button>
        </div>
      </div>
    }
    
    <!-- EDIT MODE -->
    @if (mode === 'edit') {
      <div class="view-panel view-editor">
        <!-- Title Row -->
        <div class="editor-row d-flex align-items-center gap-2 mb-2">
          <label class="editor-label">Title</label>
          <input 
            type="text" 
            class="form-control form-control-sm flex-grow-1"
            placeholder="Enter a name to save this view..."
            [(ngModel)]="editTitle"
            [disabled]="isDefaultView">
          <button 
            class="btn btn-sm btn-outline-secondary"
            (click)="cancelEdit()">
            Cancel
          </button>
          <button 
            class="btn btn-sm btn-success"
            [disabled]="!editTitle.trim()"
            title="Save as named view"
            (click)="saveView()">
            Save
          </button>
          <button 
            class="btn btn-sm btn-outline-primary"
            title="Save as new view"
            (click)="saveAsNewView()">
            Save As...
          </button>
          <button 
            class="btn btn-sm btn-outline-danger"
            [disabled]="isDefaultView || !editingView"
            title="Delete this view"
            (click)="deleteCurrentView()">
            Delete
          </button>
        </div>
        
        <!-- Filter Section -->
        <div class="editor-section mb-2" [class.disabled]="isDefaultView">
          <div class="section-header d-flex align-items-center gap-2 mb-1">
            <label class="editor-label mb-0">Filter</label>
            <span class="filter-summary flex-grow-1 text-muted small fst-italic">
              {{ getFilterSummary() }}
            </span>
          </div>
          <div class="d-flex align-items-center gap-2">
            <select 
              class="form-select form-select-sm" 
              [(ngModel)]="newFilterField"
              [disabled]="isDefaultView"
              style="max-width: 140px;">
              <option value="">Field...</option>
              @for (field of filterableFields; track field.field) {
                <option [value]="field.field">{{ field.label }}</option>
              }
            </select>
            <select 
              class="form-select form-select-sm flex-grow-1" 
              [(ngModel)]="newFilterValue"
              [disabled]="isDefaultView || !newFilterField">
              <option value="">Value...</option>
              @for (opt of getFieldOptions(newFilterField); track opt.value) {
                <option [value]="opt.value">{{ opt.label }}</option>
              }
            </select>
            <button 
              class="btn btn-sm btn-outline-danger"
              [disabled]="isDefaultView || editFilters.length === 0"
              title="Remove last filter"
              (click)="removeLastFilter()">
              <i class="bx bx-minus"></i>
            </button>
            <button 
              class="btn btn-sm btn-outline-primary"
              [disabled]="isDefaultView || !newFilterField || !newFilterValue"
              title="Add filter"
              (click)="addFilterFromInputs()">
              <i class="bx bx-plus"></i>
            </button>
          </div>
        </div>
        
        <!-- Sort Section -->
        <div class="editor-section mb-2" [class.disabled]="isDefaultView">
          <div class="section-header d-flex align-items-center gap-2 mb-1">
            <label class="editor-label mb-0">Sort</label>
            <span class="sort-summary flex-grow-1 text-muted small fst-italic">
              {{ getSortSummary() }}
            </span>
          </div>
          <div class="d-flex align-items-center gap-2">
            <select 
              class="form-select form-select-sm" 
              [(ngModel)]="newSortField"
              [disabled]="isDefaultView"
              style="max-width: 140px;">
              <option value="">Field...</option>
              @for (field of sortableFields; track field.field) {
                <option [value]="field.field">{{ field.label }}</option>
              }
            </select>
            <select 
              class="form-select form-select-sm" 
              [(ngModel)]="newSortDirection"
              [disabled]="isDefaultView || !newSortField"
              style="max-width: 100px;">
              <option value="asc">A → Z</option>
              <option value="desc">Z → A</option>
            </select>
            <div class="flex-grow-1"></div>
            <button 
              class="btn btn-sm btn-outline-danger"
              [disabled]="isDefaultView || editSorts.length === 0"
              title="Remove last sort"
              (click)="removeLastSort()">
              <i class="bx bx-minus"></i>
            </button>
            <button 
              class="btn btn-sm btn-outline-primary"
              [disabled]="isDefaultView || !newSortField"
              title="Add sort"
              (click)="addSortFromInputs()">
              <i class="bx bx-plus"></i>
            </button>
          </div>
        </div>
        
        <!-- Display Section -->
        <div class="editor-section">
          <div class="section-header d-flex align-items-center gap-2 mb-1">
            <label class="editor-label mb-0">Display</label>
            <span class="flex-grow-1 text-muted small fst-italic">
              {{ getDisplayModeName() }}
            </span>
          </div>
          <div class="d-flex align-items-center gap-2">
            <div class="btn-group">
              @for (opt of viewModeOptions; track opt.id) {
                <button 
                  type="button"
                  class="btn btn-sm"
                  [class.btn-primary]="editViewMode === opt.id"
                  [class.btn-outline-secondary]="editViewMode !== opt.id"
                  [title]="opt.label"
                  (click)="setViewMode(opt.id)">
                  <i [class]="opt.icon"></i>
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .view-panel {
      background: var(--vz-light);
      border: 1px solid var(--vz-border-color);
      border-radius: 0.25rem;
      padding: 0.5rem;
    }
    
    .view-list-scroll {
      max-height: 200px; /* ~5 rows at 40px each */
      overflow-y: auto;
      overflow-x: hidden;
    }
    
    .view-list-item {
      padding: 0.5rem 0.5rem;
      border-radius: 0.25rem;
      cursor: pointer;
      transition: background-color 0.15s ease;
      min-height: 40px;
      
      &:hover {
        background: rgba(var(--vz-primary-rgb), 0.08);
      }
      
      &.active {
        background: rgba(66, 153, 225, 0.15); /* Baby blue */
        border-left: 3px solid var(--vz-primary);
        padding-left: calc(0.5rem - 3px);
      }
      
      .view-icon {
        color: var(--vz-secondary-color);
        font-size: 1rem;
        flex-shrink: 0;
      }
      
      .view-title {
        color: var(--vz-body-color);
      }
      
      .action-btn {
        opacity: 0;
        transition: opacity 0.15s ease;
      }
      
      &:hover .action-btn {
        opacity: 1;
      }
    }
    
    .editor-row {
      padding: 0.375rem 0.5rem;
      background: var(--vz-card-bg);
      border: 1px solid var(--vz-border-color);
      border-radius: 0.25rem;
    }
    
    .editor-section {
      padding: 0.5rem;
      background: var(--vz-card-bg);
      border: 1px solid var(--vz-border-color);
      border-radius: 0.25rem;
      
      &.disabled {
        opacity: 0.5;
        pointer-events: none;
      }
    }
    
    .section-header {
      border-bottom: 1px solid var(--vz-border-color);
      padding-bottom: 0.25rem;
      margin-bottom: 0.5rem;
    }
    
    .editor-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--vz-secondary-color);
      min-width: 45px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .filter-summary, .sort-summary {
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .cursor-pointer {
      cursor: pointer;
    }
  `]
})
export class ViewPanelComponent {
  private savedViewService = inject(SavedViewService);
  
  // ═══════════════════════════════════════════════════════════════════
  // Inputs
  // ═══════════════════════════════════════════════════════════════════
  
  @Input({ required: true }) entityType!: string;
  @Input() currentParams: Record<string, string> = {};
  @Input() filters: FilterCriteria[] = [];
  @Input() sorts: SortCriteria[] = [];
  @Input() viewMode: ViewMode = 'tiles';
  @Input() fields: FieldDefinition[] = [];
  @Input() chartDefinitions: ChartDefinition[] = [];
  @Input() mode: ViewPanelMode = 'list';
  
  // ═══════════════════════════════════════════════════════════════════
  // Outputs
  // ═══════════════════════════════════════════════════════════════════
  
  @Output() modeChange = new EventEmitter<ViewPanelMode>();
  @Output() viewSelect = new EventEmitter<SavedView>();
  @Output() filtersChange = new EventEmitter<FilterCriteria[]>();
  @Output() sortsChange = new EventEmitter<SortCriteria[]>();
  @Output() viewModeChange = new EventEmitter<ViewMode>();
  @Output() apply = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  
  // ═══════════════════════════════════════════════════════════════════
  // Edit State
  // ═══════════════════════════════════════════════════════════════════
  
  editingView: SavedView | null = null;
  editTitle = '';
  editFilters: FilterCriteria[] = [];
  editSorts: SortCriteria[] = [];
  editViewMode: ViewMode = 'tiles';
  
  // Input state for simplified UI
  newFilterField = '';
  newFilterValue = '';
  newSortField = '';
  newSortDirection: 'asc' | 'desc' = 'asc';
  
  viewModeOptions = [
    { id: 'cards' as ViewMode, icon: 'bx bx-grid-alt', label: 'Cards' },
    { id: 'tiles' as ViewMode, icon: 'bx bx-menu', label: 'Tiles' },
    { id: 'table' as ViewMode, icon: 'bx bx-table', label: 'Table' },
    { id: 'list' as ViewMode, icon: 'bx bx-list-ul', label: 'List' },
  ];
  
  // ═══════════════════════════════════════════════════════════════════
  // Computed
  // ═══════════════════════════════════════════════════════════════════
  
  get savedViews(): SavedView[] {
    return this.savedViewService.getViews(this.entityType);
  }
  
  get isDefaultView(): boolean {
    return this.editingView?.isDefault === true;
  }
  
  get filterableFields(): FieldDefinition[] {
    return this.fields.filter(f => f.filterable !== false);
  }
  
  get sortableFields(): FieldDefinition[] {
    return this.fields.filter(f => f.sortable !== false);
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // Summary Methods
  // ═══════════════════════════════════════════════════════════════════
  
  getFilterSummary(): string {
    if (this.editFilters.length === 0) return 'No filters applied';
    return this.editFilters.map(f => {
      const field = this.fields.find(fd => fd.field === f.field);
      return `${field?.label || f.field}: ${f.value}`;
    }).join(' • ');
  }
  
  getSortSummary(): string {
    if (this.editSorts.length === 0) return 'Default order';
    return this.editSorts.map(s => {
      const field = this.fields.find(fd => fd.field === s.field);
      const dir = s.direction === 'asc' ? '↑' : '↓';
      return `${field?.label || s.field} ${dir}`;
    }).join(', then ');
  }
  
  getDisplayModeName(): string {
    const opt = this.viewModeOptions.find(o => o.id === this.editViewMode);
    return opt?.label || 'List';
  }
  
  getFieldOptions(fieldName: string): { value: string; label: string }[] {
    const field = this.fields.find(f => f.field === fieldName);
    if (!field?.options) return [];
    return field.options;
  }

  // ═══════════════════════════════════════════════════════════════════
  // List Mode Actions
  // ═══════════════════════════════════════════════════════════════════
  
  isActiveView(view: SavedView): boolean {
    const match = this.savedViewService.findMatchingView(this.entityType, this.currentParams);
    return match?.id === view.id;
  }
  
  getViewIcon(view: SavedView): string {
    if (view.isMru) return 'bx bx-time-five';
    if (view.isDefault) return 'bx bx-list-ul';
    return view.icon || 'bx bx-filter-alt';
  }
  
  getViewSummary(view: SavedView): string {
    return getViewSummary(view);
  }
  
  selectView(view: SavedView): void {
    this.viewSelect.emit(view);
    this.close.emit();
  }
  
  editView(view: SavedView): void {
    this.editingView = view;
    this.editTitle = view.title;
    this.editFilters = [...this.filters];
    this.editSorts = [...this.sorts];
    this.editViewMode = this.viewMode;
    this.modeChange.emit('edit');
  }
  
  startNewView(): void {
    this.editingView = null;
    this.editTitle = '';
    this.editFilters = [...this.filters];
    this.editSorts = [...this.sorts];
    this.editViewMode = this.viewMode;
    this.modeChange.emit('edit');
  }
  
  deleteView(view: SavedView): void {
    if (confirm(`Delete "${view.title}"?`)) {
      this.savedViewService.deleteView(this.entityType, view.id);
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // Edit Mode Actions
  // ═══════════════════════════════════════════════════════════════════
  
  addFilterFromInputs(): void {
    if (!this.newFilterField || !this.newFilterValue) return;
    
    const newFilter: FilterCriteria = {
      id: `filter-${Date.now()}`,
      field: this.newFilterField,
      operator: 'eq',
      value: this.newFilterValue,
    };
    
    this.editFilters = [...this.editFilters, newFilter];
    this.newFilterField = '';
    this.newFilterValue = '';
  }
  
  removeLastFilter(): void {
    if (this.editFilters.length > 0) {
      this.editFilters = this.editFilters.slice(0, -1);
    }
  }
  
  addSortFromInputs(): void {
    if (!this.newSortField) return;
    
    const newSort: SortCriteria = {
      id: `sort-${Date.now()}`,
      field: this.newSortField,
      direction: this.newSortDirection,
    };
    
    this.editSorts = [...this.editSorts, newSort];
    this.newSortField = '';
    this.newSortDirection = 'asc';
  }
  
  removeLastSort(): void {
    if (this.editSorts.length > 0) {
      this.editSorts = this.editSorts.slice(0, -1);
    }
  }
  
  setViewMode(mode: ViewMode): void {
    this.editViewMode = mode;
  }
  
  /**
   * Save changes to existing view (if editing) or create new
   */
  saveView(): void {
    const title = this.editTitle.trim();
    if (!title) return;
    
    // Apply changes first
    this.filtersChange.emit(this.editFilters);
    this.sortsChange.emit(this.editSorts);
    this.viewModeChange.emit(this.editViewMode);
    this.apply.emit();
    
    if (this.editingView && !this.editingView.isDefault && !this.editingView.isMru) {
      // Update existing view
      this.savedViewService.updateView(this.entityType, this.editingView.id, {
        title,
        urlParams: { ...this.currentParams },
      });
    } else {
      // Create new view
      this.savedViewService.createView({
        entityType: this.entityType,
        title,
        urlParams: { ...this.currentParams },
      });
    }
    
    this.modeChange.emit('list');
  }
  
  /**
   * Save as a new view (always creates new)
   */
  saveAsNewView(): void {
    const title = this.editTitle.trim() || `View ${Date.now()}`;
    
    // Apply changes first
    this.filtersChange.emit(this.editFilters);
    this.sortsChange.emit(this.editSorts);
    this.viewModeChange.emit(this.editViewMode);
    this.apply.emit();
    
    // Always create new
    this.savedViewService.createView({
      entityType: this.entityType,
      title,
      urlParams: { ...this.currentParams },
    });
    
    this.modeChange.emit('list');
  }
  
  /**
   * Delete the currently edited view
   */
  deleteCurrentView(): void {
    if (!this.editingView || this.editingView.isDefault) return;
    
    if (confirm(`Delete "${this.editingView.title}"?`)) {
      this.savedViewService.deleteView(this.entityType, this.editingView.id);
      this.modeChange.emit('list');
    }
  }
  
  cancelEdit(): void {
    this.modeChange.emit('list');
  }
}
