/**
 * EntityCrudPageComponent
 * 
 * Complete schema-driven CRUD page component.
 * Combines EntityBrowse, DynamicForm, and detail views into a single reusable page.
 * 
 * USAGE:
 * ```html
 * <app-entity-crud-page
 *   [entitySchema]="spikeSchema"
 *   [data]="spikes"
 *   [loading]="isLoading"
 *   (create)="onCreate($event)"
 *   (update)="onUpdate($event)"
 *   (delete)="onDelete($event)">
 * </app-entity-crud-page>
 * ```
 * 
 * FEATURES:
 * - Browse mode: List/grid view with filtering, sorting, pagination
 * - Add mode: Schema-driven form for creating new items
 * - Edit mode: Schema-driven form for editing existing items
 * - Detail mode: Read-only view of item details
 * - Batch operations support
 * - URL state management (optional)
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// Widget imports
import { EntityBrowseComponent, EntityBrowseItemEvent, EntityBrowseActionEvent, EntityBrowseBatchEvent } from '../entity-browse';
import { DynamicFormComponent, DynamicFormSubmitEvent, DynamicFormMode } from '../dynamic-form';

// Standard page framing
import { PageHeaderComponent } from '../../../../sites/ui/widgets/page-header';

// Schema imports
import { EntitySchema } from '../../../../core/models/schema/entity-schema.model';

// Query imports
import { FilterCriteria, SortCriteria } from '../../../../core/models/query/query-criteria.model';
import { BatchAction } from '../../../../core/models/query/batch-action.model';

// ═══════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════

export type CrudPageMode = 'browse' | 'add' | 'edit' | 'detail';

export interface CrudCreateEvent<T = Record<string, unknown>> {
  data: T;
}

export interface CrudUpdateEvent<T = Record<string, unknown>> {
  id: string;
  data: T;
  originalData: T;
}

export interface CrudDeleteEvent {
  id: string;
  ids?: string[];
}

export interface CrudPageState {
  mode: CrudPageMode;
  selectedId?: string;
  filters: FilterCriteria[];
  sorts: SortCriteria[];
  page: number;
  pageSize: number;
  searchQuery: string;
}

// ═══════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════

@Component({
selector: 'app-entity-crud-page',
standalone: true,
imports: [
  CommonModule,
  EntityBrowseComponent,
  DynamicFormComponent,
  PageHeaderComponent,
],
template: `
  <div class="entity-crud-page">
    <!-- Page Header - Using standard PageHeaderComponent -->
    <app-page-header
      [title]="pageTitle()"
      [subtitle]="pageDescription() || ''"
      [icon]="entitySchema?.icon || 'bx-data'"
      [iconBackground]="iconBackground()"
      [iconClass]="iconClass()"
      [showBack]="mode() !== 'browse'"
      [backFallback]="backFallback">
      <ng-container actions>
        @switch (mode()) {
          @case ('browse') {
            @if (showAddButton) {
              <button class="btn btn-primary" (click)="startAdd()">
                <i class="ri-add-line me-1"></i>
                Add {{ entityName() }}
              </button>
            }
          }
          @case ('add') {
            <!-- Actions handled by form -->
          }
          @case ('edit') {
            <!-- Back handled by PageHeader -->
          }
          @case ('detail') {
            @if (showEditButton) {
              <button class="btn btn-primary" (click)="startEdit()">
                <i class="ri-edit-line me-1"></i>
                Edit
              </button>
            }
            @if (showDeleteButton) {
              <button class="btn btn-danger" (click)="confirmDelete()">
                <i class="ri-delete-bin-line me-1"></i>
                Delete
              </button>
            }
          }
        }
      </ng-container>
    </app-page-header>

      <!-- Content Area -->
      <div class="entity-crud-page__content">
        @switch (mode()) {
          <!-- Browse Mode -->
          @case ('browse') {
            <app-entity-browse
              [entitySchema]="entitySchema"
              [data]="data"
              [loading]="loading"
              [page]="state().page"
              [pageSize]="state().pageSize"
              [totalCount]="totalCount"
              [filters]="state().filters"
              [sorts]="state().sorts"
              [batchActions]="batchActions"
              [showAddButton]="showAddButton"
              [addButtonLabel]="'Add ' + entityName()"
              (itemSelect)="onItemSelect($event)"
              (itemAction)="onItemAction($event)"
              (batchActionTrigger)="onBatchAction($event)"
              (searchChange)="onSearchChange($event)"
              (searchSubmit)="onSearchSubmit($event)"
              (filtersChange)="onFiltersChange($event)"
              (sortsChange)="onSortsChange($event)"
              (apply)="onApply()"
              (pageChange)="onPageChange($event)"
              (addClick)="startAdd()">
            </app-entity-browse>
          }

          <!-- Add Mode -->
          @case ('add') {
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">Add New {{ entityName() }}</h5>
                <button class="btn btn-sm btn-ghost-secondary" (click)="backToBrowse()">
                  <i class="ri-close-line"></i>
                </button>
              </div>
              <div class="card-body">
                <app-dynamic-form
                  [entitySchema]="entitySchema"
                  [mode]="'add'"
                  [showHeader]="false"
                  [submitLabel]="'Create ' + entityName()"
                  (formSubmit)="onFormSubmit($event)"
                  (formCancel)="backToBrowse()">
                </app-dynamic-form>
              </div>
            </div>
          }

          <!-- Edit Mode -->
          @case ('edit') {
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">Edit {{ entityName() }}</h5>
                <button class="btn btn-sm btn-ghost-secondary" (click)="backToBrowse()">
                  <i class="ri-close-line"></i>
                </button>
              </div>
              <div class="card-body">
                <app-dynamic-form
                  [entitySchema]="entitySchema"
                  [mode]="'edit'"
                  [data]="selectedItem()"
                  [showHeader]="false"
                  [submitLabel]="'Save Changes'"
                  (formSubmit)="onFormSubmit($event)"
                  (formCancel)="backToBrowse()">
                </app-dynamic-form>
              </div>
            </div>
          }

          <!-- Detail Mode -->
          @case ('detail') {
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">{{ entityName() }} Details</h5>
                <div class="d-flex gap-2">
                  @if (showEditButton) {
                    <button class="btn btn-sm btn-primary" (click)="startEdit()">
                      <i class="ri-edit-line me-1"></i>
                      Edit
                    </button>
                  }
                  <button class="btn btn-sm btn-ghost-secondary" (click)="backToBrowse()">
                    <i class="ri-close-line"></i>
                  </button>
                </div>
              </div>
              <div class="card-body">
                <app-dynamic-form
                  [entitySchema]="entitySchema"
                  [mode]="'detail'"
                  [data]="selectedItem()"
                  [showHeader]="false"
                  [showActions]="false">
                </app-dynamic-form>
              </div>
            </div>
          }
        }
      </div>

      <!-- Delete Confirmation Modal -->
      @if (showDeleteConfirm()) {
        <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Confirm Delete</h5>
                <button type="button" class="btn-close" (click)="cancelDelete()"></button>
              </div>
              <div class="modal-body">
                <p>Are you sure you want to delete this {{ entityName() }}?</p>
                <p class="text-danger mb-0">
                  <i class="ri-error-warning-line me-1"></i>
                  This action cannot be undone.
                </p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="cancelDelete()">Cancel</button>
                <button type="button" class="btn btn-danger" (click)="executeDelete()">Delete</button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .entity-crud-page {
      &__header {
        // Header styles
      }

      &__content {
        // Content area
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityCrudPageComponent<T extends Record<string, unknown> = Record<string, unknown>>
  implements OnInit, OnChanges {

  // ─────────────────────────────────────────────────────────────────
  // Inputs - Schema
  // ─────────────────────────────────────────────────────────────────

  /** Entity schema defining the CRUD structure */
  @Input({ required: true }) entitySchema!: EntitySchema;

  // ─────────────────────────────────────────────────────────────────
  // Inputs - Data
  // ─────────────────────────────────────────────────────────────────

  /** Data items to display */
  @Input() data: T[] = [];

  /** Loading state */
  @Input() loading = false;

  /** Total count for pagination */
  @Input() totalCount = 0;

  // ─────────────────────────────────────────────────────────────────
  // Inputs - Configuration
  // ─────────────────────────────────────────────────────────────────

  /** Show add button */
  @Input() showAddButton = true;

  /** Show edit button in detail view */
  @Input() showEditButton = true;

  /** Show delete button in detail view */
  @Input() showDeleteButton = true;

  /** Initial mode */
  @Input() initialMode: CrudPageMode = 'browse';

  /** Initial selected item ID */
  @Input() initialSelectedId?: string;

  /** Default page size */
  @Input() defaultPageSize = 10;

  /** Batch actions */
  @Input() batchActions: BatchAction[] = [
    { id: 'delete', label: 'Delete Selected', icon: 'ri-delete-bin-line', variant: 'danger' },
  ];

  /** Custom page title (overrides schema) */
  @Input() customTitle?: string;

  /** Fallback route when back is clicked with no history */
  @Input() backFallback = 'system/hub';

  // ─────────────────────────────────────────────────────────────────
  // Outputs
  // ─────────────────────────────────────────────────────────────────

  /** Create new item */
  @Output() create = new EventEmitter<CrudCreateEvent<T>>();

  /** Update existing item */
  @Output() update = new EventEmitter<CrudUpdateEvent<T>>();

  /** Delete item(s) */
  @Output() delete = new EventEmitter<CrudDeleteEvent>();

  /** Load/reload data */
  @Output() loadData = new EventEmitter<CrudPageState>();

  /** Mode changed */
  @Output() modeChange = new EventEmitter<CrudPageMode>();

  /** State changed (for URL sync) */
  @Output() stateChange = new EventEmitter<CrudPageState>();

  // ─────────────────────────────────────────────────────────────────
  // Internal State
  // ─────────────────────────────────────────────────────────────────

  private _state = signal<CrudPageState>({
    mode: 'browse',
    filters: [],
    sorts: [],
    page: 1,
    pageSize: 10,
    searchQuery: '',
  });

  private _selectedItem = signal<T | undefined>(undefined);
  private _showDeleteConfirm = signal(false);

  // Data lookup map
  private dataMap = new Map<string, T>();

  // Computed signals
  state = computed(() => this._state());
  mode = computed(() => this._state().mode);
  selectedItem = computed(() => this._selectedItem());
  showDeleteConfirm = computed(() => this._showDeleteConfirm());

  entityName = computed(() => this.entitySchema?.name || 'Item');

  pageTitle = computed(() => {
    if (this.customTitle) return this.customTitle;

    switch (this.mode()) {
      case 'browse':
        return this.entitySchema?.name || 'Items';
      case 'add':
        return `Add ${this.entityName()}`;
      case 'edit':
        return `Edit ${this.entityName()}`;
      case 'detail':
        return `${this.entityName()} Details`;
    }
  });

  pageDescription = computed(() => {
    if (this.mode() === 'browse') {
      return this.entitySchema?.description;
    }
    return undefined;
  });

  // Icon background class based on entity color
  iconBackground = computed(() => {
    const color = this.entitySchema?.color;
    if (!color) return 'bg-secondary-subtle';
    // Map common colors to Bootstrap subtle backgrounds
    if (color.includes('f7b') || color.includes('warning') || color.includes('ffc')) return 'bg-warning-subtle';
    if (color.includes('299') || color.includes('0d6') || color.includes('info')) return 'bg-info-subtle';
    if (color.includes('405') || color.includes('primary') || color.includes('0d6')) return 'bg-primary-subtle';
    if (color.includes('dc3') || color.includes('danger')) return 'bg-danger-subtle';
    if (color.includes('198') || color.includes('success')) return 'bg-success-subtle';
    return 'bg-secondary-subtle';
  });

  // Icon color class based on entity color
  iconClass = computed(() => {
    const color = this.entitySchema?.color;
    if (!color) return 'text-secondary';
    if (color.includes('f7b') || color.includes('warning') || color.includes('ffc')) return 'text-warning';
    if (color.includes('299') || color.includes('0d6') || color.includes('info')) return 'text-info';
    if (color.includes('405') || color.includes('primary') || color.includes('0d6')) return 'text-primary';
    if (color.includes('dc3') || color.includes('danger')) return 'text-danger';
    if (color.includes('198') || color.includes('success')) return 'text-success';
    return 'text-secondary';
  });

  // ─────────────────────────────────────────────────────────────────
  // Lifecycle
  // ─────────────────────────────────────────────────────────────────

  ngOnInit(): void {
    // Initialize state
    this._state.update(state => ({
      ...state,
      mode: this.initialMode,
      selectedId: this.initialSelectedId,
      pageSize: this.defaultPageSize,
    }));

    if (this.initialSelectedId) {
      this.loadSelectedItem(this.initialSelectedId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.buildDataMap();
      // If we have a selected ID, update the selected item
      const selectedId = this._state().selectedId;
      if (selectedId) {
        this.loadSelectedItem(selectedId);
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // Data Management
  // ─────────────────────────────────────────────────────────────────

  private buildDataMap(): void {
    this.dataMap.clear();
    for (const item of this.data) {
      const id = String(item['id'] || item['_id']);
      if (id) {
        this.dataMap.set(id, item);
      }
    }
  }

  private loadSelectedItem(id: string): void {
    const item = this.dataMap.get(id);
    this._selectedItem.set(item);
  }

  // ─────────────────────────────────────────────────────────────────
  // Mode Navigation
  // ─────────────────────────────────────────────────────────────────

  startAdd(): void {
    this.setMode('add');
    this._selectedItem.set(undefined);
  }

  startEdit(): void {
    this.setMode('edit');
  }

  backToBrowse(): void {
    this.setMode('browse');
    this._selectedItem.set(undefined);
    this._state.update(s => ({ ...s, selectedId: undefined }));
  }

  private setMode(mode: CrudPageMode): void {
    this._state.update(s => ({ ...s, mode }));
    this.modeChange.emit(mode);
    this.stateChange.emit(this._state());
  }

  // ─────────────────────────────────────────────────────────────────
  // Browse Event Handlers
  // ─────────────────────────────────────────────────────────────────

  onItemSelect(event: EntityBrowseItemEvent<T>): void {
    const id = String(event.item['id'] || event.item['_id']);
    this._state.update(s => ({ ...s, selectedId: id }));
    this._selectedItem.set(event.item);
    this.setMode('detail');
  }

  onItemAction(event: EntityBrowseActionEvent<T>): void {
    const id = String(event.item['id'] || event.item['_id']);

    switch (event.action.id) {
      case 'edit':
        this._state.update(s => ({ ...s, selectedId: id }));
        this._selectedItem.set(event.item);
        this.setMode('edit');
        break;
      case 'delete':
        this._state.update(s => ({ ...s, selectedId: id }));
        this._selectedItem.set(event.item);
        this.confirmDelete();
        break;
      case 'view':
      case 'detail':
        this._state.update(s => ({ ...s, selectedId: id }));
        this._selectedItem.set(event.item);
        this.setMode('detail');
        break;
    }
  }

  onBatchAction(event: EntityBrowseBatchEvent<T>): void {
    switch (event.action.id) {
      case 'delete':
        // TODO: Batch delete confirmation
        this.delete.emit({ id: event.selectedIds[0], ids: event.selectedIds });
        break;
    }
  }

  onSearchChange(query: string): void {
    this._state.update(s => ({ ...s, searchQuery: query }));
  }

  onSearchSubmit(query: string): void {
    this._state.update(s => ({ ...s, searchQuery: query, page: 1 }));
    this.emitLoadData();
  }

  onFiltersChange(filters: FilterCriteria[]): void {
    this._state.update(s => ({ ...s, filters }));
  }

  onSortsChange(sorts: SortCriteria[]): void {
    this._state.update(s => ({ ...s, sorts }));
  }

  onApply(): void {
    this._state.update(s => ({ ...s, page: 1 }));
    this.emitLoadData();
  }

  onPageChange(page: number): void {
    this._state.update(s => ({ ...s, page }));
    this.emitLoadData();
  }

  private emitLoadData(): void {
    this.loadData.emit(this._state());
    this.stateChange.emit(this._state());
  }

  // ─────────────────────────────────────────────────────────────────
  // Form Event Handlers
  // ─────────────────────────────────────────────────────────────────

  onFormSubmit(event: DynamicFormSubmitEvent): void {
    if (event.mode === 'add') {
      this.create.emit({ data: event.data as T });
    } else if (event.mode === 'edit') {
      const id = this._state().selectedId;
      if (id) {
        this.update.emit({
          id,
          data: event.data as T,
          originalData: event.originalData as T,
        });
      }
    }

    // Return to browse after submit
    this.backToBrowse();
  }

  // ─────────────────────────────────────────────────────────────────
  // Delete Handlers
  // ─────────────────────────────────────────────────────────────────

  confirmDelete(): void {
    this._showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this._showDeleteConfirm.set(false);
  }

  executeDelete(): void {
    const id = this._state().selectedId;
    if (id) {
      this.delete.emit({ id });
    }
    this._showDeleteConfirm.set(false);
    this.backToBrowse();
  }

  // ─────────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────────

  /** Get current page state */
  getState(): CrudPageState {
    return this._state();
  }

  /** Set page state (for URL restoration) */
  setState(state: Partial<CrudPageState>): void {
    this._state.update(s => ({ ...s, ...state }));
    if (state.selectedId) {
      this.loadSelectedItem(state.selectedId);
    }
  }

  /** Refresh data */
  refresh(): void {
    this.emitLoadData();
  }
}
