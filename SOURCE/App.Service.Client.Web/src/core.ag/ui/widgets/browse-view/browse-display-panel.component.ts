/**
 * Browse Display Panel Component
 * 
 * Contains:
 * - Saved Views dropdown (left) - with Customize option
 * - View mode icons (right)
 * 
 * The Customize option toggles the filter/order/display panels below.
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewMode } from './browse-view.component';
import { ChartDefinition } from '../../../../core/models/query/chart-definition.model';
import { SavedView } from '../../../../core/models/view/saved-view.model';
import { SavedViewDropdownComponent } from './saved-view-dropdown.component';

interface ViewModeOption {
  id: ViewMode;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-browse-display-panel',
  standalone: true,
  imports: [CommonModule, SavedViewDropdownComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="browse-display-panel">
      <div class="d-flex align-items-center justify-content-between gap-3">
        <!-- Left: Saved Views Dropdown -->
        @if (entityType) {
          <app-saved-view-dropdown
            [entityType]="entityType"
            [currentParams]="currentParams"
            [isCustomizing]="isCustomizing"
            (viewSelect)="onSavedViewSelect($event)"
            (customizeToggle)="onCustomizeToggle($event)">
          </app-saved-view-dropdown>
        } @else {
          <div class="display-label d-flex align-items-center gap-2">
            <i class="bx bx-filter-alt text-muted"></i>
            <span>{{ getModeLabel() }}</span>
          </div>
        }
        
        <!-- Right: View mode icons -->
        <div class="view-mode-icons d-flex align-items-center gap-1">
          @for (mode of viewModeOptions; track mode.id) {
            <button 
              type="button" 
              class="btn btn-sm"
              [class.btn-primary]="viewMode === mode.id"
              [class.btn-soft-secondary]="viewMode !== mode.id"
              [title]="mode.label"
              (click)="onModeSelect(mode.id)">
              <i [class]="mode.icon"></i>
            </button>
          }
          
          <!-- Chart button -->
          @if (chartDefinitions.length > 0) {
            <div class="dropdown" ngbDropdown>
              <button 
                type="button" 
                class="btn btn-sm"
                [class.btn-primary]="viewMode === 'chart'"
                [class.btn-soft-secondary]="viewMode !== 'chart'"
                ngbDropdownToggle
                title="Charts">
                <i class="bx bx-bar-chart-alt-2"></i>
              </button>
              <div ngbDropdownMenu class="dropdown-menu-end">
                @for (chart of chartDefinitions; track chart.id) {
                  <button 
                    class="dropdown-item d-flex align-items-center gap-2"
                    [class.active]="selectedChartId === chart.id"
                    (click)="onChartSelect(chart)">
                    <i [class]="getChartIcon(chart.type)"></i>
                    <span>{{ chart.label }}</span>
                  </button>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .browse-display-panel {
      background: var(--vz-light);
      border: 1px solid var(--vz-border-color);
      border-radius: 0.375rem;
      padding: 0.5rem 0.75rem;
      margin-bottom: 0.75rem;
    }
    
    .display-label {
      font-size: 0.875rem;
      color: var(--vz-secondary-color);
    }
    
    .view-mode-icons {
      .btn {
        padding: 0.25rem 0.5rem;
        line-height: 1;
        
        i {
          font-size: 1rem;
        }
      }
    }
  `]
})
export class BrowseDisplayPanelComponent {
  @Input() viewMode: ViewMode = 'tiles';
  @Input() chartDefinitions: ChartDefinition[] = [];
  @Input() selectedChartId: string = '';
  
  /** Entity type for saved views (e.g., 'spike') */
  @Input() entityType?: string;
  
  /** Current URL params for saved view comparison */
  @Input() currentParams: Record<string, string> = {};
  
  /** Whether customization panels are shown */
  @Input() isCustomizing = false;
  
  @Output() viewModeChange = new EventEmitter<ViewMode>();
  @Output() chartDefinitionChange = new EventEmitter<ChartDefinition>();
  
  /** Emitted when a saved view is selected */
  @Output() savedViewSelect = new EventEmitter<SavedView>();
  
  /** Emitted when user toggles customization */
  @Output() customizingChange = new EventEmitter<boolean>();
  
  viewModeOptions: ViewModeOption[] = [
    { id: 'cards', icon: 'bx bx-grid-alt', label: 'Cards' },
    { id: 'tiles', icon: 'bx bx-menu', label: 'Tiles' },
    { id: 'table', icon: 'bx bx-table', label: 'Table' },
    { id: 'list', icon: 'bx bx-list-ul', label: 'List' },
  ];
  
  getModeLabel(): string {
    if (this.viewMode === 'chart') {
      const chart = this.chartDefinitions.find(c => c.id === this.selectedChartId);
      return chart ? `Chart - ${chart.label}` : 'Chart';
    }
    const mode = this.viewModeOptions.find(m => m.id === this.viewMode);
    return mode?.label || 'Tiles';
  }
  
  getChartIcon(type: string): string {
    switch (type) {
      case 'bar':
      case 'column':
        return 'bx bx-bar-chart-alt-2';
      case 'line':
        return 'bx bx-line-chart';
      case 'pie':
        return 'bx bx-pie-chart-alt-2';
      case 'donut':
        return 'bx bx-doughnut-chart';
      default:
        return 'bx bx-bar-chart-alt-2';
    }
  }
  
  onModeSelect(mode: ViewMode): void {
    this.viewModeChange.emit(mode);
  }
  
  onChartSelect(chart: ChartDefinition): void {
    this.viewModeChange.emit('chart');
    this.chartDefinitionChange.emit(chart);
  }
  
  onSavedViewSelect(view: SavedView): void {
    this.savedViewSelect.emit(view);
  }
  
  onCustomizeToggle(isCustomizing: boolean): void {
    this.customizingChange.emit(isCustomizing);
  }
}
