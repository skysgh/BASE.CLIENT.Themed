/**
 * Browse Display Panel Component
 * 
 * Compact view mode selector with icons always visible on the right.
 * Includes saved views dropdown for quick view switching.
 * Chart mode opens dropdown to select from available chart definitions.
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
        <!-- Left: Saved Views Dropdown (if entityType provided) -->
        @if (entityType) {
          <app-saved-view-dropdown
            [entityType]="entityType"
            [currentParams]="currentParams"
            (viewSelect)="onSavedViewSelect($event)"
            (saveRequest)="onSaveView($event)">
          </app-saved-view-dropdown>
        } @else {
          <!-- Fallback: Just mode label -->
          <div class="display-label d-flex align-items-center gap-2">
            <i class="bx bx-palette text-muted"></i>
            <span class="mode-text">{{ getModeLabel() }}</span>
          </div>
        }
        
        <!-- Right: View mode icons -->
        <div class="view-mode-icons d-flex align-items-center gap-1">
          @for (mode of viewModeOptions; track mode.id) {
            <button 
              type="button" 
              class="btn btn-sm"
              [class.btn-primary]="viewMode === mode.id"
              [class.btn-outline-secondary]="viewMode !== mode.id"
              [title]="mode.label"
              (click)="onModeSelect(mode.id)">
              <i [class]="mode.icon"></i>
            </button>
          }
          
          <!-- Chart button (opens dropdown if charts available) -->
          @if (chartDefinitions.length > 0) {
            <div class="dropdown">
              <button 
                type="button" 
                class="btn btn-sm"
                [class.btn-primary]="viewMode === 'chart'"
                [class.btn-outline-secondary]="viewMode !== 'chart'"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                title="Charts">
                <i class="bx bx-bar-chart-alt-2"></i>
              </button>
              <div class="dropdown-menu dropdown-menu-end p-3" style="min-width: 220px;">
                <label class="form-label small text-muted mb-2">Select Chart</label>
                <div class="chart-options">
                  @for (chart of chartDefinitions; track chart.id) {
                    <button 
                      type="button" 
                      class="dropdown-item d-flex align-items-center gap-2 rounded mb-1"
                      [class.active]="selectedChartId === chart.id"
                      (click)="onChartSelect(chart)">
                      <i [class]="getChartIcon(chart.type)"></i>
                      <span>{{ chart.label }}</span>
                    </button>
                  }
                </div>
              </div>
            </div>
          } @else {
            <!-- Disabled chart button when no charts available -->
            <button 
              type="button" 
              class="btn btn-sm btn-outline-secondary"
              disabled
              title="No charts configured">
              <i class="bx bx-bar-chart-alt-2"></i>
            </button>
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
      font-size: 0.8125rem;
      font-style: italic;
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
    
    .chart-options {
      .dropdown-item {
        padding: 0.5rem 0.75rem;
        
        &.active {
          background-color: var(--vz-primary);
          color: white;
        }
        
        &:hover:not(.active) {
          background-color: var(--vz-light);
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
  
  @Output() viewModeChange = new EventEmitter<ViewMode>();
  @Output() chartDefinitionChange = new EventEmitter<ChartDefinition>();
  
  /** Emitted when a saved view is selected */
  @Output() savedViewSelect = new EventEmitter<SavedView>();
  
  /** Emitted when user saves a new view */
  @Output() viewSaved = new EventEmitter<{ title: string; params: Record<string, string> }>();
  
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
      case 'area':
        return 'bx bx-area';
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
  
  onSaveView(event: { title: string; params: Record<string, string> }): void {
    this.viewSaved.emit(event);
  }
}
