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
templateUrl: './browse-options-panel.component.html',
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
