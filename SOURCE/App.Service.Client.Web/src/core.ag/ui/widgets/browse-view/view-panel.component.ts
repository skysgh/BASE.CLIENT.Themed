/**
 * View Panel Component
 * 
 * Displays either list of views OR view editor (full width panel).
 * Mode is controlled by parent via input/output.
 * 
 * List mode: Shows saved views with edit/delete buttons
 * Edit mode: Shows title, filter, sort, display controls
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
        @for (view of savedViews; track view.id) {
          <div class="view-list-item d-flex align-items-center gap-2"
               [class.active]="isActiveView(view)">
            <i [class]="getViewIcon(view)" class="text-muted"></i>
            <button 
              class="btn btn-link p-0 text-start flex-grow-1 text-truncate"
              [class.fw-semibold]="isActiveView(view)"
              (click)="selectView(view)">
              {{ view.title }}
            </button>
            <span class="view-summary text-muted small flex-shrink-0">
              {{ getViewSummary(view) }}
            </span>
            @if (!view.isDefault) {
              <button 
                class="btn btn-sm btn-link text-muted p-0"
                title="Edit"
                (click)="editView(view); $event.stopPropagation()">
                <i class="bx bx-edit-alt"></i>
              </button>
              @if (!view.isMru) {
                <button 
                  class="btn btn-sm btn-link text-danger p-0"
                  title="Delete"
                  (click)="deleteView(view); $event.stopPropagation()">
                  <i class="bx bx-trash-alt"></i>
                </button>
              }
            }
          </div>
        }
        <!-- Add New -->
        <div class="mt-2 pt-2 border-top text-end">
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
            placeholder="View name..."
            [(ngModel)]="editTitle">
          <button 
            class="btn btn-sm btn-success"
            [disabled]="!canSave()"
            (click)="saveView()">
            <i class="bx bx-check me-1"></i>Save
          </button>
          <button 
            class="btn btn-sm btn-outline-secondary"
            (click)="cancelEdit()">
            <i class="bx bx-x"></i>
          </button>
        </div>
        
        <!-- Filter Row -->
        <div class="editor-row d-flex align-items-center gap-2 mb-2">
          <label class="editor-label">Filter</label>
          <div class="flex-grow-1 d-flex flex-wrap gap-1 align-items-center">
            @if (editFilters.length === 0) {
              <span class="text-muted small fst-italic">No filters</span>
            }
            @for (filter of editFilters; track filter.id) {
              <span class="badge bg-light text-dark border d-flex align-items-center gap-1">
                {{ filter.field }}: {{ filter.value }}
                <i class="bx bx-x cursor-pointer" (click)="removeFilter(filter)"></i>
              </span>
            }
          </div>
          <button 
            class="btn btn-sm btn-outline-secondary"
            (click)="addFilter()">
            <i class="bx bx-plus"></i>
          </button>
        </div>
        
        <!-- Sort Row -->
        <div class="editor-row d-flex align-items-center gap-2 mb-2">
          <label class="editor-label">Sort</label>
          <div class="flex-grow-1 d-flex flex-wrap gap-1 align-items-center">
            @if (editSorts.length === 0) {
              <span class="text-muted small fst-italic">Default order</span>
            }
            @for (sort of editSorts; track sort.id) {
              <span class="badge bg-light text-dark border d-flex align-items-center gap-1">
                {{ sort.field }} {{ sort.direction === 'asc' ? '↑' : '↓' }}
                <i class="bx bx-x cursor-pointer" (click)="removeSort(sort)"></i>
              </span>
            }
          </div>
          <button 
            class="btn btn-sm btn-outline-secondary"
            (click)="addSort()">
            <i class="bx bx-plus"></i>
          </button>
        </div>
        
        <!-- Display Row -->
        <div class="editor-row d-flex align-items-center gap-2">
          <label class="editor-label">Display</label>
          <div class="flex-grow-1"></div>
          <div class="btn-group">
            @for (opt of viewModeOptions; track opt.id) {
              <button 
                type="button"
                class="btn btn-sm"
                [class.btn-primary]="editViewMode === opt.id"
                [class.btn-outline-secondary]="editViewMode !== opt.id"
                (click)="setViewMode(opt.id)">
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
      border-radius: 0.25rem;
      padding: 0.5rem;
    }
    
    .view-list-item {
      padding: 0.375rem 0.5rem;
      border-radius: 0.25rem;
      
      &:hover {
        background: rgba(var(--vz-primary-rgb), 0.05);
      }
      
      &.active {
        background: rgba(var(--vz-primary-rgb), 0.1);
      }
      
      .btn-link {
        color: var(--vz-body-color);
        text-decoration: none;
        &:hover { color: var(--vz-primary); }
      }
    }
    
    .editor-row {
      padding: 0.375rem 0.5rem;
      background: var(--vz-card-bg);
      border: 1px solid var(--vz-border-color);
      border-radius: 0.25rem;
    }
    
    .editor-label {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--vz-secondary-color);
      min-width: 45px;
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
    return 'bx bx-filter-alt';
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
  
  canSave(): boolean {
    return true; // Can always save (either update or create)
  }
  
  addFilter(): void {
    // TODO: Show filter picker dialog
  }
  
  removeFilter(filter: FilterCriteria): void {
    this.editFilters = this.editFilters.filter(f => f.id !== filter.id);
  }
  
  addSort(): void {
    // TODO: Show sort picker dialog
  }
  
  removeSort(sort: SortCriteria): void {
    this.editSorts = this.editSorts.filter(s => s.id !== sort.id);
  }
  
  setViewMode(mode: ViewMode): void {
    this.editViewMode = mode;
  }
  
  saveView(): void {
    // Apply changes
    this.filtersChange.emit(this.editFilters);
    this.sortsChange.emit(this.editSorts);
    this.viewModeChange.emit(this.editViewMode);
    this.apply.emit();
    
    const title = this.editTitle.trim();
    
    if (title && title !== this.editingView?.title) {
      // New name = create new view
      this.savedViewService.createView({
        entityType: this.entityType,
        title,
        urlParams: { ...this.currentParams },
      });
    } else if (this.editingView && !this.editingView.isDefault) {
      // Same name = update existing
      this.savedViewService.updateView(this.entityType, this.editingView.id, {
        urlParams: { ...this.currentParams },
      });
    }
    
    this.modeChange.emit('list');
  }
  
  cancelEdit(): void {
    this.modeChange.emit('list');
  }
}
