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
templateUrl: './browse-display-panel.component.html',
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
