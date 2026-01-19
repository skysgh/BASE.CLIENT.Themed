/**
 * BrowseViewOptionsPanel Component
 * 
 * Standalone panel containing filter, sort, and display options for a browse view.
 * Can be used:
 * - Inline (current panels mode)
 * - In a flyout (compact mode)
 * 
 * This component is a pure presentation component - it receives state and emits changes.
 * The parent (BrowseView) manages the actual state.
 */
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Schema and query models
import { BrowseViewSchema, ViewMode, SchemaFieldDefinition } from './browse-view-schema.model';
import { FilterCriteria, SortCriteria, FieldDefinition } from '../../../../core/models/query/query-criteria.model';
import { ChartDefinition } from '../../../../core/models/query/chart-definition.model';

// Child panel components
import { BrowseFilterPanelComponent } from './browse-filter-panel.component';
import { BrowseOrderPanelComponent } from './browse-order-panel.component';
import { BrowseDisplayPanelComponent } from './browse-display-panel.component';

@Component({
  selector: 'app-browse-options-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BrowseFilterPanelComponent,
    BrowseOrderPanelComponent,
    BrowseDisplayPanelComponent,
  ],
  template: `
    <div class="browse-options-panel">
      <!-- Filter Panel -->
      @if (showFilter && schema?.filter?.enabled !== false) {
        <app-browse-filter-panel
          [fields]="fields"
          [filters]="filters"
          [expanded]="filterExpanded"
          (filtersChange)="onFiltersChange($event)"
          (expandedChange)="filterExpanded = $event">
        </app-browse-filter-panel>
      }

      <!-- Order Panel -->
      @if (showOrder && schema?.order?.enabled !== false) {
        <app-browse-order-panel
          [fields]="sortableFields"
          [sorts]="sorts"
          [expanded]="orderExpanded"
          (sortsChange)="onSortsChange($event)"
          (expandedChange)="orderExpanded = $event">
        </app-browse-order-panel>
      }

      <!-- Display Panel -->
      @if (showDisplay && schema?.display?.enabled !== false) {
        <app-browse-display-panel
          [viewMode]="viewMode"
          [chartDefinitions]="chartDefinitions"
          [selectedChartId]="selectedChartId"
          (viewModeChange)="onViewModeChange($event)"
          (chartDefinitionChange)="onChartDefinitionChange($event)">
        </app-browse-display-panel>
      }

      <!-- Apply Button (for flyout mode) -->
      @if (showApplyButton) {
        <div class="d-grid gap-2 mt-3">
          <button class="btn btn-primary" (click)="onApply()">
            <i class="bx bx-check me-1"></i>
            Apply
          </button>
          <button class="btn btn-outline-secondary" (click)="onReset()">
            <i class="bx bx-reset me-1"></i>
            Reset
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .browse-options-panel {
      display: flex;
      flex-direction: column;
      gap: 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseViewOptionsPanelComponent {
  // ─────────────────────────────────────────────────────────────────
  // Inputs
  // ─────────────────────────────────────────────────────────────────

  /** Browse view schema */
  @Input() schema?: BrowseViewSchema;

  /** Available filter/sort fields */
  @Input() fields: FieldDefinition[] = [];

  /** Current filters */
  @Input() filters: FilterCriteria[] = [];

  /** Current sorts */
  @Input() sorts: SortCriteria[] = [];

  /** Current view mode */
  @Input() viewMode: ViewMode = 'tiles';

  /** Chart definitions for chart view */
  @Input() chartDefinitions: ChartDefinition[] = [];

  /** Selected chart ID */
  @Input() selectedChartId: string = '';

  /** Show filter panel */
  @Input() showFilter = true;

  /** Show order panel */
  @Input() showOrder = true;

  /** Show display panel */
  @Input() showDisplay = true;

  /** Show apply/reset buttons (for flyout mode) */
  @Input() showApplyButton = false;

  // ─────────────────────────────────────────────────────────────────
  // Outputs
  // ─────────────────────────────────────────────────────────────────

  /** Filters changed */
  @Output() filtersChange = new EventEmitter<FilterCriteria[]>();

  /** Sorts changed */
  @Output() sortsChange = new EventEmitter<SortCriteria[]>();

  /** View mode changed */
  @Output() viewModeChange = new EventEmitter<ViewMode>();

  /** Chart definition changed */
  @Output() chartDefinitionChange = new EventEmitter<ChartDefinition>();

  /** Apply button clicked (flyout mode) */
  @Output() apply = new EventEmitter<void>();

  /** Reset button clicked (flyout mode) */
  @Output() reset = new EventEmitter<void>();

  // ─────────────────────────────────────────────────────────────────
  // Internal State
  // ─────────────────────────────────────────────────────────────────

  filterExpanded = false;
  orderExpanded = false;
  displayExpanded = false;

  // ─────────────────────────────────────────────────────────────────
  // Computed
  // ─────────────────────────────────────────────────────────────────

  get sortableFields(): FieldDefinition[] {
    return this.fields.filter(f => f.sortable !== false);
  }

  get availableModes(): ViewMode[] {
    return this.schema?.display?.availableModes || ['tiles', 'table', 'cards', 'list'];
  }

  // ─────────────────────────────────────────────────────────────────
  // Event Handlers
  // ─────────────────────────────────────────────────────────────────

  onFiltersChange(filters: FilterCriteria[]): void {
    this.filtersChange.emit(filters);
  }

  onSortsChange(sorts: SortCriteria[]): void {
    this.sortsChange.emit(sorts);
  }

  onViewModeChange(mode: ViewMode): void {
    this.viewModeChange.emit(mode);
  }

  onChartDefinitionChange(chart: ChartDefinition): void {
    this.chartDefinitionChange.emit(chart);
  }

  onApply(): void {
    this.apply.emit();
  }

  onReset(): void {
    this.reset.emit();
  }
}
