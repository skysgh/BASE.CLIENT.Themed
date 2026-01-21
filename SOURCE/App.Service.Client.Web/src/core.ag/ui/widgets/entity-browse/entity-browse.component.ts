/**
 * EntityBrowseComponent
 * 
 * Schema-driven browse component that configures BrowseView from EntitySchema.
 * Automatically derives columns, filters, and display options from the entity definition.
 * 
 * USAGE:
 * ```html
 * <app-entity-browse
 *   [entitySchema]="spikeSchema"
 *   [data]="spikes"
 *   (itemSelect)="onSpikeSelect($event)"
 *   (itemAction)="onSpikeAction($event)">
 * </app-entity-browse>
 * ```
 * 
 * FEATURES:
 * - Auto-generates columns from EntitySchema.fields
 * - Auto-generates filter fields from schema
 * - Auto-generates sort fields from schema
 * - Supports all BrowseView features
 * - Emits strongly-typed events
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

// BrowseView imports
import {
  BrowseViewComponent,
  BrowseViewSchema,
  ViewMode,
  CardClickEvent,
} from '../browse-view/browse-view.component';
import { IUniversalCardData, ICardAction } from '../../../../core/models/presentation/universal-card.model';
import { IColumnDefinition, CellType } from '../../../../core/models/presentation/presentation-profile.model';
import { FilterCriteria, SortCriteria, FieldDefinition, FieldType } from '../../../../core/models/query/query-criteria.model';
import { BatchAction, BatchActionEvent } from '../../../../core/models/query/batch-action.model';

// Schema imports
import { EntitySchema, EntityFieldDefinition } from '../../../../core/models/schema/entity-schema.model';
import { FormFieldType } from '../../../../core/models/schema/form-field-schema.model';
import { FieldOption } from '../../../../core/models/schema/options-source.model';

// ═══════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════

export interface EntityBrowseItemEvent<T = Record<string, unknown>> {
  item: T;
  card: IUniversalCardData;
}

export interface EntityBrowseActionEvent<T = Record<string, unknown>> {
  item: T;
  action: ICardAction;
  card: IUniversalCardData;
}

export interface EntityBrowseBatchEvent<T = Record<string, unknown>> {
  action: BatchAction;
  selectedIds: string[];
  selectedItems: T[];
}

// ═══════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-entity-browse',
  standalone: true,
  imports: [
    CommonModule,
    BrowseViewComponent,
  ],
  templateUrl: './entity-browse.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityBrowseComponent<T extends Record<string, unknown> = Record<string, unknown>>
  implements OnInit, OnChanges {

  // ─────────────────────────────────────────────────────────────────
  // Inputs - Schema
  // ─────────────────────────────────────────────────────────────────

  /** Entity schema defining the browse structure */
  @Input() entitySchema?: EntitySchema;

  /** Pre-built browse schema (alternative to entitySchema) */
  @Input() browseViewSchema?: BrowseViewSchema;

  // ─────────────────────────────────────────────────────────────────
  // Inputs - Data
  // ─────────────────────────────────────────────────────────────────

  /** Raw data items to display */
  @Input() data: T[] = [];

  /** Loading state */
  @Input() loading = false;

  /** Total count for pagination */
  @Input() totalCount = 0;

  /** Current page */
  @Input() page = 1;

  /** Page size */
  @Input() pageSize = 10;

  // ─────────────────────────────────────────────────────────────────
  // Inputs - Configuration
  // ─────────────────────────────────────────────────────────────────

  /** Initial view mode */
  @Input() viewMode: ViewMode = 'tiles';

  /** Show search panel */
  @Input() showSearch = true;

  /** Show filter panel */
  @Input() showFilterPanel = true;

  /** Show order panel */
  @Input() showOrderPanel = true;

  /** Show display panel */
  @Input() showDisplayPanel = true;

  /** Show actions bar */
  @Input() showActionsBar = true;

  /** Controls layout mode: 'panels' (inline) or 'flyout' (compact) */
  @Input() controlsLayout: 'panels' | 'flyout' = 'panels';

  /** Batch actions */
  @Input() batchActions: BatchAction[] = [];

  /** Empty message */
  @Input() emptyMessage = 'No items found';

  /** Empty icon */
  @Input() emptyIcon = 'bx bx-folder-open';

  /** Show add button in empty state */
  @Input() showAddButton = true;

  /** Add button label */
  @Input() addButtonLabel = 'Add New';

  /** Function to transform data item to card */
  @Input() cardTransformer?: (item: T, schema?: EntitySchema) => IUniversalCardData;

  // ─────────────────────────────────────────────────────────────────
  // Inputs - State
  // ─────────────────────────────────────────────────────────────────

  /** Current filters */
  @Input() filters: FilterCriteria[] = [];

  /** Current sorts */
  @Input() sorts: SortCriteria[] = [];

  // ─────────────────────────────────────────────────────────────────
  // Outputs
  // ─────────────────────────────────────────────────────────────────

  /** Item selected (single click without modifiers) */
  @Output() itemSelect = new EventEmitter<EntityBrowseItemEvent<T>>();

  /** Item action clicked */
  @Output() itemAction = new EventEmitter<EntityBrowseActionEvent<T>>();

  /** Batch action triggered */
  @Output() batchActionTrigger = new EventEmitter<EntityBrowseBatchEvent<T>>();

  /** Selection changed */
  @Output() selectionChange = new EventEmitter<T[]>();

  /** Search changed */
  @Output() searchChange = new EventEmitter<string>();

  /** Search submitted */
  @Output() searchSubmit = new EventEmitter<string>();

  /** Filters changed */
  @Output() filtersChange = new EventEmitter<FilterCriteria[]>();

  /** Sorts changed */
  @Output() sortsChange = new EventEmitter<SortCriteria[]>();

  /** Apply clicked (filters/sorts) */
  @Output() apply = new EventEmitter<void>();

  /** View mode changed */
  @Output() viewModeChange = new EventEmitter<ViewMode>();

  /** Page changed */
  @Output() pageChange = new EventEmitter<number>();

  /** Add button clicked */
  @Output() addClick = new EventEmitter<void>();

  // ─────────────────────────────────────────────────────────────────
  // Internal State
  // ─────────────────────────────────────────────────────────────────

  private _browseSchema = signal<BrowseViewSchema | undefined>(undefined);
  private _columns = signal<IColumnDefinition[]>([]);
  private _filterFields = signal<FieldDefinition[]>([]);
  private _cardData = signal<IUniversalCardData[]>([]);

  // Data lookup map for getting original items
  private dataMap = new Map<string, T>();

  // Computed signals
  browseSchema = computed(() => this._browseSchema() || this.browseViewSchema);
  columns = computed(() => this._columns());
  filterFields = computed(() => this._filterFields());
  cardData = computed(() => this._cardData());

  // ─────────────────────────────────────────────────────────────────
  // Lifecycle
  // ─────────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.buildFromSchema();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entitySchema'] || changes['browseViewSchema']) {
      this.buildFromSchema();
    }
    if (changes['data']) {
      this.buildCardData();
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // Schema Building
  // ─────────────────────────────────────────────────────────────────

  private buildFromSchema(): void {
    if (this.entitySchema) {
      this._columns.set(this.buildColumns(this.entitySchema));
      this._filterFields.set(this.buildFilterFields(this.entitySchema));
      this._browseSchema.set(this.buildBrowseSchema(this.entitySchema));
    }
    this.buildCardData();
  }

  private buildColumns(schema: EntitySchema): IColumnDefinition[] {
    const columns: IColumnDefinition[] = [];
    const browseView = schema.views?.browse;

    // Auto-generate from fields (fields is an array of EntityFieldDefinition)
    for (const field of schema.fields) {
      // Skip hidden fields and system fields
      if (field.hidden || field.field.startsWith('_')) continue;

      columns.push({
        field: field.field,
        label: field.label || field.field,
        type: this.mapFieldTypeToCellType(field.type),
        sortable: field.sortable ?? true,
      });
    }

    return columns;
  }

  private buildFilterFields(schema: EntitySchema): FieldDefinition[] {
    const fields: FieldDefinition[] = [];

    // fields is an array of EntityFieldDefinition
    for (const field of schema.fields) {
      // Skip fields that aren't filterable
      if (field.hidden || !field.filterable) continue;

      const options = this.extractOptions(field);

      fields.push({
        field: field.field,
        label: field.label || field.field,
        type: this.mapFieldTypeToQueryType(field.type),
        sortable: field.sortable ?? true,
        filterable: field.filterable ?? true,
        options: options,
      });
    }

    return fields;
  }

  private extractOptions(field: EntityFieldDefinition): Array<{ value: string; label: string }> | undefined {
    if (!field.optionsSource) return undefined;
    
    // Check if it's a static options source with items array
    const source = field.optionsSource as { items?: FieldOption[] };
    if (source.items && Array.isArray(source.items)) {
      return source.items.map((opt: FieldOption) => ({
        value: String(opt.value),
        label: opt.label,
      }));
    }
    return undefined;
  }

  private buildBrowseSchema(schema: EntitySchema): BrowseViewSchema {
    const browseView = schema.views?.browse;

    return {
      version: '1.0',
      id: `${schema.id}-browse`,
      name: `Browse ${schema.name}`,
      title: schema.name,
      description: schema.description,
      search: {
        enabled: true,
        placeholder: `Search ${schema.name}...`,
      },
      filter: {
        enabled: true,
        fields: this.buildFilterFields(schema) as any,
      },
      order: {
        enabled: true,
        fields: this.buildFilterFields(schema).filter(f => f.sortable) as any,
      },
      display: {
        enabled: true,
        availableModes: ['tiles', 'table', 'cards', 'list'],
        defaultMode: 'tiles',
      },
      pagination: {
        enabled: true,
        pageSize: 10,
      },
      emptyState: {
        message: `No ${schema.name} found`,
        icon: 'bx bx-folder-open',
        showAddButton: true,
        addButtonLabel: `Add ${schema.name}`,
      },
    };
  }

  private buildCardData(): void {
    this.dataMap.clear();

    const cards = this.data.map(item => {
      const card = this.transformToCard(item);
      this.dataMap.set(card.id, item);
      return card;
    });

    this._cardData.set(cards);
  }

  private transformToCard(item: T): IUniversalCardData {
    // Use custom transformer if provided
    if (this.cardTransformer) {
      return this.cardTransformer(item, this.entitySchema);
    }

    // Auto-transform based on schema
    const schema = this.entitySchema;
    const id = String(item['id'] || item['_id'] || crypto.randomUUID());
    
    // Get field names from schema (fields is an array)
    const fieldNames = (schema?.fields || []).map(f => f.field);

    // Find title field - look for isPrimary first, then common names
    const primaryField = (schema?.fields || []).find(f => f.isPrimary);
    const titleField = primaryField?.field || 
      fieldNames.find(name => ['title', 'name', 'label', 'displayName'].includes(name.toLowerCase())) || 
      'title';

    // Find subtitle field
    const subtitleField = fieldNames.find(name =>
        ['description', 'subtitle', 'summary'].includes(name.toLowerCase())
      );

    // Find image field
    const imageField = fieldNames.find(name =>
      ['image', 'imageUrl', 'avatar', 'photo', 'thumbnail'].includes(name)
    );

    // Find badge/status field
    const badgeField = fieldNames.find(name =>
      ['status', 'state', 'badge', 'type'].includes(name.toLowerCase())
    );

    return {
      id,
      entityType: schema?.id || 'unknown',
      title: String(item[titleField] || 'Untitled'),
      subtitle: subtitleField ? String(item[subtitleField] || '') : undefined,
      image: imageField ? String(item[imageField] || '') : undefined,
      status: badgeField ? { label: String(item[badgeField] || ''), variant: 'neutral' as const } : undefined,
      cells: [],
      payload: item as Record<string, unknown>,
    };
  }

  private mapFieldTypeToCellType(schemaType: FormFieldType): CellType {
    const typeMap: Record<string, CellType> = {
      'text': 'text',
      'textarea': 'text',
      'email': 'text',
      'url': 'link',
      'number': 'number',
      'currency': 'money',
      'percentage': 'number',
      'select': 'badge',
      'multiselect': 'tags',
      'checkbox': 'boolean',
      'toggle': 'boolean',
      'date': 'date',
      'datetime': 'datetime',
      'time': 'time',
    };
    return typeMap[schemaType] || 'text';
  }

  private mapFieldTypeToQueryType(schemaType: FormFieldType): FieldType {
    const typeMap: Record<string, FieldType> = {
      'text': 'text',
      'textarea': 'text',
      'email': 'text',
      'url': 'text',
      'number': 'number',
      'currency': 'number',
      'percentage': 'number',
      'select': 'select',
      'multiselect': 'multiselect',
      'checkbox': 'boolean',
      'toggle': 'boolean',
      'date': 'date',
      'datetime': 'datetime',
      'time': 'text',
    };
    return typeMap[schemaType] || 'text';
  }

  // ─────────────────────────────────────────────────────────────────
  // Event Handlers
  // ─────────────────────────────────────────────────────────────────

  onCardClick(card: IUniversalCardData): void {
    const item = this.dataMap.get(card.id);
    if (item) {
      this.itemSelect.emit({ item, card });
    }
  }

  onCardAction(event: { card: IUniversalCardData; action: ICardAction }): void {
    const item = this.dataMap.get(event.card.id);
    if (item) {
      this.itemAction.emit({
        item,
        action: event.action,
        card: event.card,
      });
    }
  }

  onFiltersChange(filters: FilterCriteria[]): void {
    this.filters = filters;
    this.filtersChange.emit(filters);
  }

  onSortsChange(sorts: SortCriteria[]): void {
    this.sorts = sorts;
    this.sortsChange.emit(sorts);
  }

  onSelectionChange(selectedIds: Set<string>): void {
    const selectedItems = Array.from(selectedIds)
      .map(id => this.dataMap.get(id))
      .filter((item): item is T => item !== undefined);
    this.selectionChange.emit(selectedItems);
  }

  onBatchAction(event: BatchActionEvent): void {
    const selectedItems = event.selectedIds
      .map(id => this.dataMap.get(id))
      .filter((item): item is T => item !== undefined);
    this.batchActionTrigger.emit({
      action: event.action,
      selectedIds: event.selectedIds,
      selectedItems,
    });
  }
}
