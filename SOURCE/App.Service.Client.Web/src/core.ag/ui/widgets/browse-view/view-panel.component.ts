/**
 * View Panel Component
 * 
 * State machine for managing saved views:
 * - collapsed: Just shows view button
 * - list: Shows list of saved views with edit/delete
 * - edit: Shows view editor (title, filter, sort, display)
 * 
 * Handles dirty tracking - changes auto-save to current view or prompt for new name.
 */
import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
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
    <!-- View Toggle Button (always visible) -->
    <button 
      type="button"
      class="btn d-flex align-items-center gap-2"
      [class.btn-primary]="mode() !== 'collapsed'"
      [class.btn-soft-secondary]="mode() === 'collapsed'"
      (click)="togglePanel()">
      <i class="bx bx-filter-alt"></i>
      <span>{{ currentViewName }}</span>
      <i class="bx bx-xs" 
         [class.bx-chevron-up]="mode() !== 'collapsed'" 
         [class.bx-chevron-down]="mode() === 'collapsed'"></i>
      @if (isDirty()) {
        <span class="badge bg-warning-subtle text-warning ms-1">•</span>
      }
    </button>
    
    <!-- Expanded Panel -->
    @if (mode() !== 'collapsed') {
      <div class="view-panel-content mt-2">
        
        <!-- LIST MODE -->
        @if (mode() === 'list') {
          <div class="view-list">
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
                <span class="view-summary text-muted small text-truncate" style="max-width: 200px;">
                  {{ getViewSummary(view) }}
                </span>
                @if (!view.isDefault) {
                  <button 
                    class="btn btn-sm btn-link text-muted p-0"
                    title="Edit"
                    (click)="editView(view)">
                    <i class="bx bx-edit-alt"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-link text-danger p-0"
                    title="Delete"
                    (click)="deleteView(view)">
                    <i class="bx bx-trash-alt"></i>
                  </button>
                }
              </div>
            }
            <!-- Add New Button -->
            <div class="mt-2 pt-2 border-top">
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
        @if (mode() === 'edit') {
          <div class="view-editor">
            <!-- Title Row -->
            <div class="editor-section mb-2">
              <div class="d-flex align-items-center gap-2">
                <label class="form-label mb-0 small text-muted" style="min-width: 50px;">Title</label>
                <input 
                  type="text" 
                  class="form-control form-control-sm flex-grow-1"
                  placeholder="View name..."
                  [(ngModel)]="editTitle"
                  (ngModelChange)="markDirty()">
                <button 
                  class="btn btn-sm btn-success"
                  [disabled]="!canSave()"
                  (click)="saveView()">
                  Save
                </button>
                <button 
                  class="btn btn-sm btn-outline-secondary"
                  (click)="cancelEdit()">
                  Cancel
                </button>
              </div>
            </div>
            
            <!-- Filter Row -->
            <div class="editor-section mb-2">
              <div class="d-flex align-items-center gap-2">
                <label class="form-label mb-0 small text-muted" style="min-width: 50px;">Filter</label>
                <div class="flex-grow-1 d-flex flex-wrap gap-1">
                  @if (editFilters.length === 0) {
                    <span class="text-muted small fst-italic">No filters</span>
                  }
                  @for (filter of editFilters; track filter.id) {
                    <span class="badge bg-light text-dark border">
                      {{ filter.field }}: {{ filter.value }}
                      <button class="btn-close btn-close-sm ms-1" (click)="removeFilter(filter)"></button>
                    </span>
                  }
                </div>
                <button 
                  class="btn btn-sm btn-outline-secondary"
                  (click)="addFilter()">
                  <i class="bx bx-plus"></i>
                </button>
              </div>
            </div>
            
            <!-- Sort Row -->
            <div class="editor-section mb-2">
              <div class="d-flex align-items-center gap-2">
                <label class="form-label mb-0 small text-muted" style="min-width: 50px;">Sort</label>
                <div class="flex-grow-1 d-flex flex-wrap gap-1">
                  @if (editSorts.length === 0) {
                    <span class="text-muted small fst-italic">Default order</span>
                  }
                  @for (sort of editSorts; track sort.id) {
                    <span class="badge bg-light text-dark border">
                      {{ sort.field }} {{ sort.direction === 'asc' ? '↑' : '↓' }}
                      <button class="btn-close btn-close-sm ms-1" (click)="removeSort(sort)"></button>
                    </span>
                  }
                </div>
                <button 
                  class="btn btn-sm btn-outline-secondary"
                  (click)="addSort()">
                  <i class="bx bx-plus"></i>
                </button>
              </div>
            </div>
            
            <!-- Display Row -->
            <div class="editor-section">
              <div class="d-flex align-items-center gap-2">
                <label class="form-label mb-0 small text-muted" style="min-width: 50px;">Display</label>
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
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .view-panel-content {
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
    
    .editor-section {
      padding: 0.375rem 0.5rem;
      background: var(--vz-card-bg);
      border: 1px solid var(--vz-border-color);
      border-radius: 0.25rem;
    }
    
    .btn-close-sm {
      font-size: 0.5rem;
      padding: 0.15rem;
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
  
  // ═══════════════════════════════════════════════════════════════════
  // Outputs
  // ═══════════════════════════════════════════════════════════════════
  
  @Output() viewSelect = new EventEmitter<SavedView>();
  @Output() filtersChange = new EventEmitter<FilterCriteria[]>();
  @Output() sortsChange = new EventEmitter<SortCriteria[]>();
  @Output() viewModeChange = new EventEmitter<ViewMode>();
  @Output() apply = new EventEmitter<void>();
  
  // ═══════════════════════════════════════════════════════════════════
  // State
  // ═══════════════════════════════════════════════════════════════════
  
  mode = signal<ViewPanelMode>('collapsed');
  isDirty = signal(false);
  
  // Edit state
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
  
  get currentViewName(): string {
    const match = this.savedViewService.findMatchingView(this.entityType, this.currentParams);
    if (match) return match.title;
    if (this.isDirty()) return 'Custom';
    return 'All Items';
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // Actions
  // ═══════════════════════════════════════════════════════════════════
  
  togglePanel(): void {
    if (this.mode() === 'collapsed') {
      this.mode.set('list');
    } else {
      this.mode.set('collapsed');
    }
  }
  
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
    this.mode.set('collapsed');
    this.isDirty.set(false);
  }
  
  editView(view: SavedView): void {
    this.editingView = view;
    this.editTitle = view.title;
    // Parse view params to get filters/sorts
    this.editFilters = [...this.filters];
    this.editSorts = [...this.sorts];
    this.editViewMode = this.viewMode;
    this.mode.set('edit');
  }
  
  startNewView(): void {
    this.editingView = null;
    this.editTitle = '';
    this.editFilters = [...this.filters];
    this.editSorts = [...this.sorts];
    this.editViewMode = this.viewMode;
    this.mode.set('edit');
  }
  
  deleteView(view: SavedView): void {
    if (confirm(`Delete "${view.title}"?`)) {
      this.savedViewService.deleteView(this.entityType, view.id);
    }
  }
  
  // Edit mode actions
  markDirty(): void {
    this.isDirty.set(true);
  }
  
  canSave(): boolean {
    return this.isDirty() || this.editTitle.trim().length > 0;
  }
  
  addFilter(): void {
    // TODO: Show filter picker
    this.markDirty();
  }
  
  removeFilter(filter: FilterCriteria): void {
    this.editFilters = this.editFilters.filter(f => f.id !== filter.id);
    this.markDirty();
  }
  
  addSort(): void {
    // TODO: Show sort picker
    this.markDirty();
  }
  
  removeSort(sort: SortCriteria): void {
    this.editSorts = this.editSorts.filter(s => s.id !== sort.id);
    this.markDirty();
  }
  
  setViewMode(mode: ViewMode): void {
    this.editViewMode = mode;
    this.markDirty();
  }
  
  saveView(): void {
    // Apply changes to parent
    this.filtersChange.emit(this.editFilters);
    this.sortsChange.emit(this.editSorts);
    this.viewModeChange.emit(this.editViewMode);
    this.apply.emit();
    
    const title = this.editTitle.trim();
    
    if (title && title !== this.editingView?.title) {
      // Save as new view
      this.savedViewService.createView({
        entityType: this.entityType,
        title,
        urlParams: { ...this.currentParams },
      });
    } else if (this.editingView && !this.editingView.isDefault) {
      // Update existing view
      this.savedViewService.updateView(this.entityType, this.editingView.id, {
        urlParams: { ...this.currentParams },
      });
    }
    
    this.isDirty.set(false);
    this.mode.set('list');
  }
  
  cancelEdit(): void {
    this.editingView = null;
    this.editTitle = '';
    this.mode.set('list');
  }
}
