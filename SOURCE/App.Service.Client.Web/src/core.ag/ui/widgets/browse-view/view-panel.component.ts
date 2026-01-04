/**
 * View Panel Component
 * 
 * Two modes:
 * 1. LIST MODE: Shows saved views with icon, name, summary - click to select
 * 2. EDIT MODE: Title row + Filter section + Sort section + Display section
 * 
 * Per diagram:
 * - List has scrollbar capped at ~5 rows
 * - Edit mode has sections: Title (with Cancel/Save/SaveAs/Delete), Filter, Sort, Display
 * - Changes apply in real-time (no separate Apply button)
 * - Default "All Items" disables filter/sort editing and delete button
 */
import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  ChangeDetectionStrategy,
  inject,
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
      <div class="view-panel">
        <div class="view-list-scroll">
          @for (view of savedViews; track view.id) {
            <div class="view-list-item d-flex align-items-center gap-2"
                 [class.selected]="isActiveView(view)"
                 (click)="selectView(view)">
              <i [class]="getViewIcon(view)" class="view-icon text-primary"></i>
              <span class="view-name">{{ view.title }}</span>
              <span class="view-summary flex-grow-1 text-muted small fst-italic text-truncate">
                {{ getViewSummary(view) }}
              </span>
              @if (!view.isDefault) {
                <button 
                  class="btn btn-sm btn-link p-0 edit-btn"
                  title="Edit view"
                  (click)="editView(view); $event.stopPropagation()">
                  <i class="bx bx-edit-alt"></i>
                </button>
              }
            </div>
          }
        </div>
        <div class="mt-2 pt-2 border-top text-end">
          <button class="btn btn-sm btn-outline-primary" (click)="startNewView()">
            <i class="bx bx-plus me-1"></i>New View
          </button>
        </div>
      </div>
    }
    
    <!-- EDIT MODE -->
    @if (mode === 'edit') {
      <div class="view-panel">
        <!-- Title Section -->
        <div class="edit-section mb-2">
          <div class="section-label">Title</div>
          <div class="d-flex align-items-center gap-2">
            <input type="text" class="form-control form-control-sm" style="max-width: 180px;"
              placeholder="View name..." [(ngModel)]="editTitle" [disabled]="isDefaultView">
            <button class="btn btn-sm btn-outline-secondary" (click)="cancelEdit()">Cancel</button>
            <button class="btn btn-sm btn-success" [disabled]="!editTitle.trim() || isDefaultView" (click)="saveView()">Save</button>
            <button class="btn btn-sm btn-outline-primary" (click)="saveAsNewView()">Save As...</button>
            <button class="btn btn-sm btn-outline-danger" [disabled]="isDefaultView || !editingView" (click)="deleteCurrentView()">Delete</button>
          </div>
        </div>
        
        <!-- Filter Section -->
        <div class="edit-section mb-2" [class.disabled-section]="isDefaultView">
          <div class="section-label">Filter</div>
          <div class="section-summary text-muted small fst-italic mb-1">{{ getFilterSummary() }}</div>
          <div class="d-flex align-items-center gap-2">
            <select class="form-select form-select-sm" style="max-width: 120px;" [(ngModel)]="newFilterField" [disabled]="isDefaultView">
              <option value="">Field...</option>
              @for (field of filterableFields; track field.field) {
                <option [value]="field.field">{{ field.label }}</option>
              }
            </select>
            <select class="form-select form-select-sm" style="max-width: 120px;" [(ngModel)]="newFilterValue" [disabled]="isDefaultView || !newFilterField">
              <option value="">Value...</option>
              @for (opt of getFieldOptions(newFilterField); track opt.value) {
                <option [value]="opt.value">{{ opt.label }}</option>
              }
            </select>
            <button class="btn btn-sm btn-outline-secondary" [disabled]="isDefaultView || editFilters.length === 0" (click)="removeLastFilter()"><i class="bx bx-minus"></i></button>
            <button class="btn btn-sm btn-outline-primary" [disabled]="isDefaultView || !newFilterField || !newFilterValue" (click)="addFilterFromInputs()"><i class="bx bx-plus"></i></button>
          </div>
        </div>
        
        <!-- Sort Section -->
        <div class="edit-section mb-2" [class.disabled-section]="isDefaultView">
          <div class="section-label">Sort</div>
          <div class="section-summary text-muted small fst-italic mb-1">{{ getSortSummary() }}</div>
          <div class="d-flex align-items-center gap-2">
            <select class="form-select form-select-sm" style="max-width: 120px;" [(ngModel)]="newSortField" [disabled]="isDefaultView">
              <option value="">Field...</option>
              @for (field of sortableFields; track field.field) {
                <option [value]="field.field">{{ field.label }}</option>
              }
            </select>
            <select class="form-select form-select-sm" style="max-width: 100px;" [(ngModel)]="newSortDirection" [disabled]="isDefaultView || !newSortField">
              <option value="asc">A → Z</option>
              <option value="desc">Z → A</option>
            </select>
            <button class="btn btn-sm btn-outline-secondary" [disabled]="isDefaultView || editSorts.length === 0" (click)="removeLastSort()"><i class="bx bx-minus"></i></button>
            <button class="btn btn-sm btn-outline-primary" [disabled]="isDefaultView || !newSortField" (click)="addSortFromInputs()"><i class="bx bx-plus"></i></button>
          </div>
        </div>
        
        <!-- Display Section -->
        <div class="edit-section">
          <div class="section-label">Display</div>
          <div class="d-flex align-items-center gap-2 mt-1">
            @for (opt of viewModeOptions; track opt.id) {
              <button type="button" class="btn btn-sm display-btn" [class.active]="editViewMode === opt.id" [title]="opt.label" (click)="setViewMode(opt.id)">
                <i [class]="opt.icon"></i>
              </button>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .view-panel {
      background: var(--vz-light);
      border: 1px solid var(--vz-border-color);
      border-radius: 0.375rem;
      padding: 0.75rem;
    }
    .view-list-scroll { max-height: 200px; overflow-y: auto; }
    .view-list-item {
      padding: 0.5rem;
      border-radius: 0.25rem;
      cursor: pointer;
      border: 1px solid transparent;
      &:hover { background: rgba(var(--vz-primary-rgb), 0.05); .edit-btn { opacity: 1; } }
      &.selected { background: rgba(66, 153, 225, 0.15); border-color: rgba(66, 153, 225, 0.3); }
      .view-icon { font-size: 1.25rem; }
      .view-name { font-weight: 500; min-width: 80px; }
      .edit-btn { opacity: 0; transition: opacity 0.15s; }
    }
    .edit-section {
      background: var(--vz-card-bg);
      border: 1px dashed var(--vz-border-color);
      border-radius: 0.25rem;
      padding: 0.5rem;
      &.disabled-section { opacity: 0.5; pointer-events: none; }
    }
    .section-label {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--vz-secondary-color);
      margin-bottom: 0.25rem;
    }
    .section-summary { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .display-btn {
      padding: 0.375rem 0.5rem;
      border: 1px solid var(--vz-border-color);
      background: var(--vz-card-bg);
      &.active { background: var(--vz-primary); border-color: var(--vz-primary); color: #fff; }
      &:hover:not(.active) { background: rgba(var(--vz-primary-rgb), 0.1); }
      i { font-size: 1rem; }
    }
  `]
})
export class ViewPanelComponent {
  private savedViewService = inject(SavedViewService);
  
  @Input({ required: true }) entityType!: string;
  @Input() currentParams: Record<string, string> = {};
  @Input() filters: FilterCriteria[] = [];
  @Input() sorts: SortCriteria[] = [];
  @Input() viewMode: ViewMode = 'tiles';
  @Input() fields: FieldDefinition[] = [];
  @Input() chartDefinitions: ChartDefinition[] = [];
  @Input() mode: ViewPanelMode = 'list';
  
  @Output() modeChange = new EventEmitter<ViewPanelMode>();
  @Output() viewSelect = new EventEmitter<SavedView>();
  @Output() filtersChange = new EventEmitter<FilterCriteria[]>();
  @Output() sortsChange = new EventEmitter<SortCriteria[]>();
  @Output() viewModeChange = new EventEmitter<ViewMode>();
  @Output() apply = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  
  editingView: SavedView | null = null;
  editTitle = '';
  editFilters: FilterCriteria[] = [];
  editSorts: SortCriteria[] = [];
  editViewMode: ViewMode = 'tiles';
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
  
  get savedViews(): SavedView[] { return this.savedViewService.getViews(this.entityType); }
  get isDefaultView(): boolean { return this.editingView?.isDefault === true; }
  get filterableFields(): FieldDefinition[] { return this.fields.filter(f => f.filterable !== false); }
  get sortableFields(): FieldDefinition[] { return this.fields.filter(f => f.sortable !== false); }
  
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
      return `${field?.label || s.field} ${s.direction === 'asc' ? '↑' : '↓'}`;
    }).join(', then ');
  }
  
  getFieldOptions(fieldName: string): { value: string; label: string }[] {
    const field = this.fields.find(f => f.field === fieldName);
    return field?.options || [];
  }
  
  isActiveView(view: SavedView): boolean {
    const match = this.savedViewService.findMatchingView(this.entityType, this.currentParams);
    return match?.id === view.id;
  }
  
  getViewIcon(view: SavedView): string {
    if (view.isMru) return 'bx bx-time-five';
    if (view.isDefault) return 'bx bx-list-ul';
    return view.icon || 'bx bx-layer';
  }
  
  getViewSummary(view: SavedView): string { return getViewSummary(view); }
  
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
  
  addFilterFromInputs(): void {
    if (!this.newFilterField || !this.newFilterValue) return;
    const newFilter: FilterCriteria = { id: `filter-${Date.now()}`, field: this.newFilterField, operator: 'eq', value: this.newFilterValue };
    this.editFilters = [...this.editFilters, newFilter];
    this.newFilterField = '';
    this.newFilterValue = '';
    this.filtersChange.emit(this.editFilters);
  }
  
  removeLastFilter(): void {
    if (this.editFilters.length > 0) {
      this.editFilters = this.editFilters.slice(0, -1);
      this.filtersChange.emit(this.editFilters);
    }
  }
  
  addSortFromInputs(): void {
    if (!this.newSortField) return;
    const newSort: SortCriteria = { id: `sort-${Date.now()}`, field: this.newSortField, direction: this.newSortDirection };
    this.editSorts = [...this.editSorts, newSort];
    this.newSortField = '';
    this.newSortDirection = 'asc';
    this.sortsChange.emit(this.editSorts);
  }
  
  removeLastSort(): void {
    if (this.editSorts.length > 0) {
      this.editSorts = this.editSorts.slice(0, -1);
      this.sortsChange.emit(this.editSorts);
    }
  }
  
  setViewMode(mode: ViewMode): void {
    this.editViewMode = mode;
    this.viewModeChange.emit(mode);
  }
  
  saveView(): void {
    const title = this.editTitle.trim();
    if (!title || this.isDefaultView) return;
    if (this.editingView && !this.editingView.isDefault && !this.editingView.isMru) {
      this.savedViewService.updateView(this.entityType, this.editingView.id, { title, urlParams: { ...this.currentParams } });
    } else {
      this.savedViewService.createView({ entityType: this.entityType, title, urlParams: { ...this.currentParams } });
    }
    this.modeChange.emit('list');
  }
  
  saveAsNewView(): void {
    const title = this.editTitle.trim() || `View ${Date.now()}`;
    this.savedViewService.createView({ entityType: this.entityType, title, urlParams: { ...this.currentParams } });
    this.modeChange.emit('list');
  }
  
  deleteCurrentView(): void {
    if (!this.editingView || this.editingView.isDefault) return;
    if (confirm(`Delete "${this.editingView.title}"?`)) {
      this.savedViewService.deleteView(this.entityType, this.editingView.id);
      this.modeChange.emit('list');
    }
  }
  
  cancelEdit(): void { this.modeChange.emit('list'); }
}
