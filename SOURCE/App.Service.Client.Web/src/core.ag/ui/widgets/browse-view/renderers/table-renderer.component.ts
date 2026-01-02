/**
 * Table Renderer Component
 * 
 * Renders data in a sortable table with selection support.
 * Dynamically renders columns based on column definitions.
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { IUniversalCardData, ICardAction } from '../../../../../core/models/presentation/universal-card.model';
import { IColumnDefinition } from '../../../../../core/models/presentation/presentation-profile.model';
import { SortChangeEvent, CardClickEvent } from '../browse-view.component';

@Component({
  selector: 'app-table-renderer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="browse-table">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <!-- Select All Checkbox -->
              <th scope="col" style="width: 40px;">
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    [checked]="allSelected"
                    [indeterminate]="someSelected"
                    (change)="onSelectAll($event)">
                </div>
              </th>
              <!-- Icon Column -->
              <th scope="col" style="width: 50px;"></th>
              <!-- Dynamic Columns -->
              @for (col of visibleColumns; track col.field) {
                <th scope="col" [class.sortable]="col.sortable">
                  @if (col.sortable) {
                    <a (click)="onSort(col.field)" 
                       class="text-dark text-decoration-none d-flex align-items-center gap-1 cursor-pointer">
                      {{ col.label }}
                      @if (sortColumn === col.field) {
                        <i class="bx" [class.bx-sort-up]="sortDirection === 'asc'" [class.bx-sort-down]="sortDirection === 'desc'"></i>
                      }
                    </a>
                  } @else {
                    {{ col.label }}
                  }
                </th>
              }
              <!-- Actions Column -->
              <th scope="col" style="width: 80px;" class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (card of cards; track card.id) {
              <tr [class.table-primary]="isSelected(card.id)" (click)="onClick($event, card)">
                <!-- Row Checkbox -->
                <td (click)="$event.stopPropagation()">
                  <div class="form-check">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      [checked]="isSelected(card.id)"
                      (change)="onRowSelect($event, card)">
                  </div>
                </td>
                
                <!-- Icon -->
                <td>
                  <div class="table-icon" [class]="card.iconBackground || 'bg-primary-subtle'">
                    @if (card.initials) {
                      <span class="initials-sm">{{ card.initials }}</span>
                    } @else {
                      <i [class]="card.icon || 'bx bx-file'"></i>
                    }
                  </div>
                </td>
                
                <!-- Dynamic Columns -->
                @for (col of visibleColumns; track col.field) {
                  <td>
                    @switch (col.field) {
                      @case ('title') {
                        <h6 class="mb-0">{{ card.title }}</h6>
                        @if (card.subtitle) {
                          <small class="text-muted">{{ card.subtitle }}</small>
                        }
                      }
                      @case ('description') {
                        <span class="text-truncate d-inline-block" style="max-width: 200px;">
                          {{ card.description }}
                        </span>
                      }
                      @case ('status') {
                        @if (card.status) {
                          <span class="badge" [class]="'bg-' + card.status.variant + '-subtle text-' + card.status.variant">
                            {{ card.status.label }}
                          </span>
                        }
                      }
                      @default {
                        {{ getCellValue(card, col.field) }}
                      }
                    }
                  </td>
                }
                
                <!-- Actions -->
                <td (click)="$event.stopPropagation()" class="text-end">
                  <div class="d-inline-flex align-items-center gap-2">
                    <!-- View icon -->
                    <a [routerLink]="getCardLink(card)" 
                       class="btn btn-sm btn-link p-0 text-muted"
                       title="View">
                      <i class="bx bx-show"></i>
                    </a>
                    
                    <!-- More actions dropdown -->
                    @if (card.actions && card.actions.length > 0) {
                      <div class="dropdown">
                        <button class="btn btn-sm btn-link p-0 text-muted" data-bs-toggle="dropdown">
                          <i class="bx bx-dots-vertical-rounded"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                          @for (action of card.actions; track action.id) {
                            <li>
                              @if (action.routerLink) {
                                <a class="dropdown-item" [routerLink]="action.routerLink">
                                  @if (action.icon) {
                                    <i [class]="action.icon + ' me-2'"></i>
                                  }
                                  {{ action.label }}
                                </a>
                              } @else {
                                <button class="dropdown-item" (click)="onAction(card, action)">
                                  @if (action.icon) {
                                    <i [class]="action.icon + ' me-2'"></i>
                                  }
                                  {{ action.label }}
                                </button>
                              }
                            </li>
                          }
                        </ul>
                      </div>
                    }
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .sortable {
      cursor: pointer;
      user-select: none;
      
      &:hover {
        background-color: var(--vz-tertiary-bg);
      }
    }
    
    .cursor-pointer {
      cursor: pointer;
    }
    
    .table-icon {
      width: 32px;
      height: 32px;
      border-radius: 0.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      
      i {
        font-size: 1rem;
        color: var(--vz-primary);
      }
      
      .initials-sm {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--vz-primary);
      }
    }
    
    tbody tr {
      cursor: pointer;
      
      &:hover {
        td h6 {
          color: var(--vz-primary);
        }
      }
    }
  `]
})
export class TableRendererComponent {
  @Input() cards: IUniversalCardData[] = [];
  @Input() columns: IColumnDefinition[] = [];
  @Input() selectedIds: Set<string> = new Set();
  @Input() sortColumn = '';
  @Input() sortDirection: 'asc' | 'desc' = 'asc';
  
  @Output() sortChange = new EventEmitter<SortChangeEvent>();
  @Output() cardClick = new EventEmitter<CardClickEvent>();
  @Output() cardAction = new EventEmitter<{ card: IUniversalCardData; action: ICardAction }>();
  
  get visibleColumns(): IColumnDefinition[] {
    return this.columns.filter(c => c.visible !== false);
  }
  
  get allSelected(): boolean {
    return this.cards.length > 0 && this.cards.every(c => this.selectedIds.has(c.id));
  }
  
  get someSelected(): boolean {
    const count = this.cards.filter(c => this.selectedIds.has(c.id)).length;
    return count > 0 && count < this.cards.length;
  }
  
  getCardLink(card: IUniversalCardData): string[] {
    if (card.primaryAction?.routerLink) {
      return card.primaryAction.routerLink;
    }
    return ['../', card.id];
  }
  
  getCellValue(card: IUniversalCardData, field: string): string {
    // Look in cells array for matching field
    const cell = card.cells?.find(c => c.label.toLowerCase() === field.toLowerCase());
    if (cell) {
      return cell.value?.toString() || '';
    }
    // Fallback to direct property access
    return (card as any)[field]?.toString() || '';
  }
  
  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }
  
  onClick(event: MouseEvent, card: IUniversalCardData): void {
    this.cardClick.emit({
      card,
      ctrlKey: event.ctrlKey || event.metaKey,
      shiftKey: event.shiftKey,
      isLongPress: false,
    });
  }
  
  onRowSelect(event: Event, card: IUniversalCardData): void {
    this.cardClick.emit({
      card,
      ctrlKey: true,
      shiftKey: false,
      isLongPress: false,
    });
  }
  
  onSelectAll(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    // Emit click events for all cards
    for (const card of this.cards) {
      if (checkbox.checked !== this.selectedIds.has(card.id)) {
        this.cardClick.emit({
          card,
          ctrlKey: true,
          shiftKey: false,
          isLongPress: false,
        });
      }
    }
  }
  
  onSort(column: string): void {
    const direction = this.sortColumn === column && this.sortDirection === 'desc' ? 'asc' : 'desc';
    this.sortChange.emit({ column, direction });
  }
  
  onAction(card: IUniversalCardData, action: ICardAction): void {
    this.cardAction.emit({ card, action });
  }
}
