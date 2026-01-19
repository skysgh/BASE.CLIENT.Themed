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
import { Router } from '@angular/router';

// Widget imports
import { EntityBrowseComponent, EntityBrowseItemEvent, EntityBrowseActionEvent, EntityBrowseBatchEvent } from '../entity-browse';
import { DynamicFormComponent, DynamicFormSubmitEvent, DynamicFormMode } from '../dynamic-form';

// Standard page framing
import { PageHeaderComponent } from '../../../../sites/ui/widgets/page-header';

// Navigation
import { NavigationService } from '../../../../core/services/navigation.service';

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

/**
 * Configuration for a child entity relationship (1-to-many)
 * Used to display nested tables in detail view
 */
export interface ChildEntityConfig<T = Record<string, unknown>> {
  /** Unique ID for this relationship */
  id: string;
  
  /** Display title (e.g., "Planets") */
  title: string;
  
  /** Icon class */
  icon?: string;
  
  /** Child entity schema (for rendering columns) */
  schema?: EntitySchema;
  
  /** Foreign key field on child pointing to parent */
  foreignKey: string;
  
  /** Columns to display */
  columns: { field: string; label: string; }[];
  
  /** Child data items */
  data: T[];
  
  /** Whether user can add new children */
  canAdd?: boolean;
  
  /** Label for add button */
  addLabel?: string;
  
  /** Route for viewing child detail (template: e.g., '/planets/:id') */
  detailRoute?: string;
  
  /** Route for adding new child (template: e.g., '/planets/new?starSystemId=:parentId') */
  addRoute?: string;
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
    [showBack]="true"
    [backFallback]="backFallback"
    (backClick)="onBackClick()">
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
              [data]="filteredAndSortedData()"
              [loading]="loading"
              [page]="state().page"
              [pageSize]="state().pageSize"
              [totalCount]="filteredAndSortedData().length"
              [filters]="state().filters"
              [sorts]="state().sorts"
              [batchActions]="batchActions"
              [showAddButton]="showAddButton"
              [addButtonLabel]="'Add ' + entityName()"
              [controlsLayout]="controlsLayout"
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
            <app-dynamic-form
              [entitySchema]="entitySchema"
              [mode]="'add'"
              [showHeader]="false"
              [submitLabel]="'Create ' + entityName()"
              [lockedFields]="lockedFields"
              (formSubmit)="onFormSubmit($event)"
              (formCancel)="navigateToBrowse()">
            </app-dynamic-form>
          }

          <!-- Edit Mode -->
          @case ('edit') {
            <app-dynamic-form
              [entitySchema]="entitySchema"
              [mode]="'edit'"
              [data]="selectedItem()"
              [showHeader]="false"
              [submitLabel]="'Save Changes'"
              (formSubmit)="onFormSubmit($event)"
              (formCancel)="navigateToDetail(state().selectedId!)">
            </app-dynamic-form>
          }

          <!-- Detail Mode -->
              @case ('detail') {
                <app-dynamic-form
                  [entitySchema]="entitySchema"
                  [mode]="'detail'"
                  [data]="selectedItem()"
                  [showHeader]="false"
                  [showActions]="false">
                </app-dynamic-form>
            
                <!-- Child Entities (1-to-many relationships) -->
                @for (child of childEntities; track child.id) {
                  <div class="card mt-4">
                    <div class="card-header d-flex justify-content-between align-items-center">
                      <h5 class="mb-0">
                        @if (child.icon) {
                          <i class="{{ child.icon }} me-2"></i>
                        }
                        {{ child.title }} ({{ child.data.length }})
                      </h5>
                      @if (child.canAdd) {
                        <button 
                          type="button" 
                          class="btn btn-sm btn-primary"
                          (click)="onChildAdd(child)">
                          <i class="ri-add-line me-1"></i>
                          {{ child.addLabel || 'Add' }}
                        </button>
                      }
                    </div>
                    <div class="card-body p-0">
                      @if (child.data.length > 0) {
                        <div class="table-responsive">
                          <table class="table table-hover mb-0">
                            <thead>
                              <tr>
                                @for (col of child.columns; track col.field) {
                                  <th>{{ col.label }}</th>
                                }
                                <th style="width: 80px;"></th>
                              </tr>
                            </thead>
                            <tbody>
                              @for (item of child.data; track item['id']) {
                                <tr class="cursor-pointer" (click)="onChildView(child, item)">
                                  @for (col of child.columns; track col.field) {
                                    <td>{{ item[col.field] }}</td>
                                  }
                                  <td class="text-end">
                                    <i class="ri-arrow-right-s-line text-muted"></i>
                                  </td>
                                </tr>
                              }
                            </tbody>
                          </table>
                        </div>
                      } @else {
                        <div class="text-center py-4">
                          <i class="{{ child.icon || 'ri-folder-line' }} fs-48 text-muted"></i>
                          <p class="text-muted mt-2 mb-0">No {{ child.title.toLowerCase() }} yet</p>
                        </div>
                      }
                    </div>
                  </div>
                }
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

private navigationService = inject(NavigationService);
private router = inject(Router);

  // ─────────────────────────────────────────────────────────────────
  // Inputs - Schema
  // ─────────────────────────────────────────────────────────────────

  /** Entity schema defining the CRUD structure */
  @Input({ required: true }) entitySchema!: EntitySchema;

  // ─────────────────────────────────────────────────────────────────
  // Inputs - Data
  // ─────────────────────────────────────────────────────────────────

  /** Data items to display */
  @Input() 
  set data(value: T[]) {
    this._data.set(value);
  }
  get data(): T[] {
    return this._data();
  }
  private _data = signal<T[]>([]);

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

  /** Initial mode (from route or default) */
  @Input() initialMode: CrudPageMode = 'browse';

  /** Initial selected item ID (from route :id param) */
  @Input() initialSelectedId?: string;

  /** Default page size */
  @Input() defaultPageSize = 10;

  /** 
   * Use Angular Router for navigation between modes.
   * When true, mode changes navigate to new URLs instead of updating internal state.
   * URL patterns: /base, /base/new, /base/:id, /base/:id/edit
   */
  @Input() useRouterNavigation = false;
  
  /**
   * Base path for router navigation (e.g., '/apps/astronomy/star-systems-v2')
   * Required when useRouterNavigation is true.
   */
  @Input() routeBasePath = '';

  /** Batch actions */
  @Input() batchActions: BatchAction[] = [
    { id: 'delete', label: 'Delete Selected', icon: 'ri-delete-bin-line', variant: 'danger' },
  ];

  /** Custom page title (overrides schema) */
  @Input() customTitle?: string;

  /** Fallback route when back is clicked with no history */
  @Input() backFallback = 'system/hub';

  /** Controls layout mode: 'panels' (inline) or 'flyout' (compact with flyout) */
  @Input() controlsLayout: 'panels' | 'flyout' = 'panels';

  /**
   * Child entity configurations for 1-to-many relationships.
   * Displayed as sub-tables in detail view.
   */
  @Input() childEntities: ChildEntityConfig[] = [];

  /**
   * Locked/preset field values for add mode.
   * Used when creating a child entity from parent context.
   * Example: { starSystemId: 'sol' } when adding planet from star system
   */
  @Input() lockedFields: Record<string, unknown> = {};

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

  /** Child entity action (view, add, edit) */
  @Output() childAction = new EventEmitter<{ childId: string; action: 'view' | 'add' | 'edit'; itemId?: string; parentId: string }>();

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

  /**
   * Client-side filtered and sorted data
   * Applies search query, filters, and sorts to the input data
   */
  filteredAndSortedData = computed(() => {
    let result = [...this._data()];  // Use signal for reactivity
    const state = this._state();
    
    // Apply search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      const searchableFields = this.entitySchema?.fields
        ?.filter(f => f.searchable)
        .map(f => f.field) || ['name', 'title', 'description'];
      
      result = result.filter(item => 
        searchableFields.some(field => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(query);
        })
      );
    }
    
    // Apply filters (skip filters with empty/null/undefined values)
    for (const filter of state.filters) {
      // Skip this filter if value is empty, null, or undefined
      if (filter.value === null || filter.value === undefined || filter.value === '') {
        continue;
      }
      
      result = result.filter(item => {
        const value = item[filter.field];
        const filterValue = filter.value;
        
        // Handle null/undefined item values
        if (value === null || value === undefined) {
          return filter.operator === 'ne'; // Only 'not equals' matches null
        }
        
        switch (filter.operator) {
          case 'eq':
            return String(value).toLowerCase() === String(filterValue).toLowerCase();
          case 'ne':
            return String(value).toLowerCase() !== String(filterValue).toLowerCase();
          case 'contains':
            return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
          case 'startsWith':
            return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
          case 'endsWith':
            return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());
          case 'gt':
            return Number(value) > Number(filterValue);
          case 'gte':
            return Number(value) >= Number(filterValue);
          case 'lt':
            return Number(value) < Number(filterValue);
          case 'lte':
            return Number(value) <= Number(filterValue);
          default:
            return true;
        }
      });
    }
    
    // Apply sorts
    if (state.sorts.length > 0) {
      result.sort((a, b) => {
        for (const sort of state.sorts) {
          const aVal = a[sort.field];
          const bVal = b[sort.field];
          
          let comparison = 0;
          if (aVal == null && bVal == null) comparison = 0;
          else if (aVal == null) comparison = 1;
          else if (bVal == null) comparison = -1;
          else if (typeof aVal === 'string' && typeof bVal === 'string') {
            comparison = aVal.localeCompare(bVal);
          } else {
            comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          }
          
          if (comparison !== 0) {
            return sort.direction === 'desc' ? -comparison : comparison;
          }
        }
        return 0;
      });
    }
    
    return result;
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
  // Mode Navigation (URL-based when useRouterNavigation=true)
  // ─────────────────────────────────────────────────────────────────

  /**
   * Handle back button click based on current mode
   * - Browse mode: Navigate back (to Hub or previous page)
   * - Other modes: Go back to detail (from edit) or browse
   */
  onBackClick(): void {
    if (this.mode() === 'browse') {
      // In browse mode, navigate back to hub/previous page
      this.navigationService.back(this.backFallback);
    } else if (this.mode() === 'edit') {
      // From edit, go back to detail view
      this.navigateToDetail(this._state().selectedId!);
    } else if (this.mode() === 'add') {
      // From add, go back to browse
      this.navigateToBrowse();
    } else {
      // From detail, go back to browse
      this.navigateToBrowse();
    }
  }

  /** Navigate to add mode */
  startAdd(): void {
    if (this.useRouterNavigation && this.routeBasePath) {
      this.router.navigate([this.routeBasePath, 'new']);
    } else {
      this.setModeInternal('add');
      this._selectedItem.set(undefined);
    }
  }

  /** Navigate to edit mode */
  startEdit(): void {
    const id = this._state().selectedId;
    if (this.useRouterNavigation && this.routeBasePath && id) {
      this.router.navigate([this.routeBasePath, id, 'edit']);
    } else {
      this.setModeInternal('edit');
    }
  }

  /** Navigate to detail mode */
  navigateToDetail(id: string): void {
    if (this.useRouterNavigation && this.routeBasePath) {
      this.router.navigate([this.routeBasePath, id]);
    } else {
      this._state.update(s => ({ ...s, selectedId: id }));
      this.loadSelectedItem(id);
      this.setModeInternal('detail');
    }
  }

  /** Navigate to browse mode */
  navigateToBrowse(): void {
    if (this.useRouterNavigation && this.routeBasePath) {
      this.router.navigate([this.routeBasePath]);
    } else {
      this.setModeInternal('browse');
      this._selectedItem.set(undefined);
      this._state.update(s => ({ ...s, selectedId: undefined }));
    }
  }

  /** @deprecated Use navigateToBrowse instead */
  backToBrowse(): void {
    this.navigateToBrowse();
  }

  /** Internal state update (used when NOT using router navigation) */
  private setModeInternal(mode: CrudPageMode): void {
    this._state.update(s => ({ ...s, mode }));
    this.modeChange.emit(mode);
    this.stateChange.emit(this._state());
  }

  // ─────────────────────────────────────────────────────────────────
  // Browse Event Handlers
  // ─────────────────────────────────────────────────────────────────

  onItemSelect(event: EntityBrowseItemEvent<T>): void {
    const id = String(event.item['id'] || event.item['_id']);
    this._selectedItem.set(event.item);
    this.navigateToDetail(id);
  }

  onItemAction(event: EntityBrowseActionEvent<T>): void {
    const id = String(event.item['id'] || event.item['_id']);

    switch (event.action.id) {
      case 'edit':
        this._state.update(s => ({ ...s, selectedId: id }));
        this._selectedItem.set(event.item);
        if (this.useRouterNavigation && this.routeBasePath) {
          this.router.navigate([this.routeBasePath, id, 'edit']);
        } else {
          this.setModeInternal('edit');
        }
        break;
      case 'delete':
        this._state.update(s => ({ ...s, selectedId: id }));
        this._selectedItem.set(event.item);
        this.confirmDelete();
        break;
      case 'view':
      case 'detail':
        this._selectedItem.set(event.item);
        this.navigateToDetail(id);
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
    const id = this._state().selectedId;
    
    if (event.mode === 'add') {
      this.create.emit({ data: event.data as T });
      // After add, go to browse (or could go to detail if we get back the new ID)
      this.navigateToBrowse();
    } else if (event.mode === 'edit') {
      if (id) {
        this.update.emit({
          id,
          data: event.data as T,
          originalData: event.originalData as T,
        });
      }
      // After edit, go back to detail view for the same item
      if (id) {
        this.navigateToDetail(id);
      } else {
        this.navigateToBrowse();
      }
    }
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
  // Child Entity Handlers
  // ─────────────────────────────────────────────────────────────────

  onChildView(child: ChildEntityConfig, item: Record<string, unknown>): void {
    const parentId = this._state().selectedId;
    const itemId = String(item['id'] || item['_id']);
    
    if (child.detailRoute && parentId) {
      // Navigate via router
      const route = child.detailRoute.replace(':id', itemId);
      this.router.navigate([route]);
    } else {
      // Emit event for parent to handle
      this.childAction.emit({
        childId: child.id,
        action: 'view',
        itemId,
        parentId: parentId || '',
      });
    }
  }

  onChildAdd(child: ChildEntityConfig): void {
    const parentId = this._state().selectedId;
    
    if (child.addRoute && parentId) {
      // Navigate via router
      const route = child.addRoute.replace(':parentId', parentId);
      this.router.navigate([route]);
    } else {
      // Emit event for parent to handle
      this.childAction.emit({
        childId: child.id,
        action: 'add',
        parentId: parentId || '',
      });
    }
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
