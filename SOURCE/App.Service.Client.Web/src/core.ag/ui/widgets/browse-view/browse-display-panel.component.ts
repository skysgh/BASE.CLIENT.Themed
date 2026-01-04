/**
 * Browse Display Panel Component
 * 
 * Simple row showing current display mode with view mode icons.
 * Pattern: ⊙ List                    [⊞][≡][⊟][☰][📊]
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { ViewMode } from './browse-view.component';
import { ChartDefinition } from '../../../../core/models/query/chart-definition.model';

interface ViewModeOption {
  id: ViewMode;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-browse-display-panel',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="browse-display-panel">
      <div class="d-flex align-items-center">
        <!-- Label -->
        <div class="display-label flex-grow-1">
          <i class="bx bx-show me-2 text-muted"></i>
          <span>{{ getModeLabel() }}</span>
        </div>
        
        <!-- View mode icons -->
        <div class="view-mode-icons d-flex align-items-center gap-1">
          @for (mode of viewModeOptions; track mode.id) {
            <button 
              type="button" 
              class="btn btn-sm"
              [class.btn-soft-primary]="viewMode === mode.id"
              [class.btn-soft-secondary]="viewMode !== mode.id"
              [title]="mode.label"
              (click)="onModeSelect(mode.id)">
              <i [class]="mode.icon"></i>
            </button>
          }
          
          <!-- Chart dropdown if available -->
          @if (chartDefinitions.length > 0) {
            <div ngbDropdown class="d-inline-block">
              <button 
                type="button" 
                class="btn btn-sm"
                [class.btn-soft-primary]="viewMode === 'chart'"
                [class.btn-soft-secondary]="viewMode !== 'chart'"
                ngbDropdownToggle
                title="Charts">
                <i class="bx bx-bar-chart-alt-2"></i>
              </button>
              <div ngbDropdownMenu class="dropdown-menu-end">
                @for (chart of chartDefinitions; track chart.id) {
                  <button 
                    ngbDropdownItem
                    [class.active]="selectedChartId === chart.id"
                    (click)="onChartSelect(chart)">
                    {{ chart.label }}
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
      border-radius: 0.25rem;
      padding: 0.375rem 0.5rem;
    }
    
    .display-label {
      font-size: 0.8125rem;
      color: var(--vz-body-color);
    }
    
    .view-mode-icons .btn {
      padding: 0.2rem 0.4rem;
      line-height: 1;
      
      i { font-size: 0.875rem; }
    }
  `]
})
export class BrowseDisplayPanelComponent {
  @Input() viewMode: ViewMode = 'tiles';
  @Input() chartDefinitions: ChartDefinition[] = [];
  @Input() selectedChartId: string = '';
  
  @Output() viewModeChange = new EventEmitter<ViewMode>();
  @Output() chartDefinitionChange = new EventEmitter<ChartDefinition>();
  
  viewModeOptions: ViewModeOption[] = [
    { id: 'cards', icon: 'bx bx-grid-alt', label: 'Cards' },
    { id: 'tiles', icon: 'bx bx-menu', label: 'Tiles' },
    { id: 'table', icon: 'bx bx-table', label: 'Table' },
    { id: 'list', icon: 'bx bx-list-ul', label: 'List' },
  ];
  
  getModeLabel(): string {
    if (this.viewMode === 'chart') {
      const chart = this.chartDefinitions.find(c => c.id === this.selectedChartId);
      return chart ? chart.label : 'Chart';
    }
    const mode = this.viewModeOptions.find(m => m.id === this.viewMode);
    return mode?.label || 'List';
  }
  
  onModeSelect(mode: ViewMode): void {
    this.viewModeChange.emit(mode);
  }
  
  onChartSelect(chart: ChartDefinition): void {
    this.viewModeChange.emit('chart');
    this.chartDefinitionChange.emit(chart);
  }
}
