/**
 * Browse View Toggle Component
 * 
 * View mode switcher (cards/tiles/table/list).
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewMode } from './browse-view.component';

@Component({
  selector: 'app-browse-view-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="btn-group btn-group-sm">
      <button
        type="button"
        class="btn"
        [class.btn-primary]="viewMode === 'cards'"
        [class.btn-outline-secondary]="viewMode !== 'cards'"
        (click)="setMode('cards')"
        title="Cards - Detailed view">
        <i class="bx bx-grid-alt"></i>
      </button>
      <button
        type="button"
        class="btn"
        [class.btn-primary]="viewMode === 'tiles'"
        [class.btn-outline-secondary]="viewMode !== 'tiles'"
        (click)="setMode('tiles')"
        title="Tiles - Compact rows">
        <i class="bx bx-menu"></i>
      </button>
      <button
        type="button"
        class="btn"
        [class.btn-primary]="viewMode === 'table'"
        [class.btn-outline-secondary]="viewMode !== 'table'"
        (click)="setMode('table')"
        title="Table - Sortable columns">
        <i class="bx bx-table"></i>
      </button>
      <button
        type="button"
        class="btn"
        [class.btn-primary]="viewMode === 'list'"
        [class.btn-outline-secondary]="viewMode !== 'list'"
        (click)="setMode('list')"
        title="List - Simple view">
        <i class="bx bx-list-ul"></i>
      </button>
    </div>
  `
})
export class BrowseViewToggleComponent {
  @Input() viewMode: ViewMode = 'tiles';
  @Output() viewModeChange = new EventEmitter<ViewMode>();
  
  setMode(mode: ViewMode): void {
    this.viewModeChange.emit(mode);
  }
}
