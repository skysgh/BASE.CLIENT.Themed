/**
 * Tiles Renderer Component
 * 
 * Renders compact horizontal rows (full width).
 * Supports multi-select with visual selection state.
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { IUniversalCardData, ICardAction } from '../../../../core/models/presentation/universal-card.model';
import { CardClickEvent } from '../browse-view.component';

@Component({
  selector: 'app-tiles-renderer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="browse-tiles">
      @for (card of cards; track card.id) {
        <div 
          class="tile card mb-2"
          [class.selected]="isSelected(card.id)"
          (click)="onClick($event, card)"
          (mousedown)="onMouseDown($event, card)"
          (mouseup)="onMouseUp()">
          <div class="card-body py-2 px-3">
            <div class="d-flex align-items-center gap-3">
              <!-- Selection Checkbox -->
              <div class="tile-select flex-shrink-0" [class.visible]="isSelected(card.id)">
                <div class="selection-checkbox" [class.checked]="isSelected(card.id)">
                  @if (isSelected(card.id)) {
                    <i class="bx bx-check"></i>
                  }
                </div>
              </div>
              
              <!-- Icon -->
              <div class="tile-icon flex-shrink-0" [class]="card.iconBackground || 'bg-primary-subtle'">
                @if (card.initials) {
                  <span class="initials-sm">{{ card.initials }}</span>
                } @else {
                  <i [class]="card.icon || 'bx bx-file'"></i>
                }
              </div>
              
              <!-- Main Content -->
              <div class="tile-content flex-grow-1 min-width-0">
                <div class="d-flex align-items-center gap-2">
                  <h6 class="mb-0 text-dark text-truncate">{{ card.title }}</h6>
                  @if (card.status) {
                    <span class="badge flex-shrink-0" [class]="'bg-' + card.status.variant + '-subtle text-' + card.status.variant">
                      {{ card.status.label }}
                    </span>
                  }
                </div>
                @if (card.subtitle || card.description) {
                  <small class="text-muted text-truncate d-block">
                    {{ card.subtitle || card.description }}
                  </small>
                }
              </div>
              
              <!-- Key Cells (inline) -->
              @if (card.cells && card.cells.length > 0) {
                <div class="tile-cells d-none d-md-flex gap-4 flex-shrink-0">
                  @for (cell of card.cells.slice(0, 2); track cell.label) {
                    <div class="tile-cell text-end">
                      <small class="text-muted d-block">{{ cell.label }}</small>
                      @switch (cell.type) {
                        @case ('badge') {
                          <span class="badge" [class]="'bg-' + (cell.badgeVariant || 'secondary') + '-subtle text-' + (cell.badgeVariant || 'secondary')">
                            {{ cell.value }}
                          </span>
                        }
                        @default {
                          <span class="fw-medium text-dark">{{ cell.value }}</span>
                        }
                      }
                    </div>
                  }
                </div>
              }
              
              <!-- Actions -->
              <div class="tile-actions flex-shrink-0 d-flex align-items-center gap-2">
                @if (card.actions && card.actions.length > 0) {
                  @for (action of card.actions.slice(0, 1); track action.id) {
                    @if (action.routerLink) {
                      <a [routerLink]="action.routerLink"
                         (click)="$event.stopPropagation()"
                         class="btn btn-sm btn-link p-0 text-muted"
                         title="View">
                        <i class="bx bx-show"></i>
                      </a>
                    }
                  }
                } @else {
                  <i class="bx bx-show text-muted"></i>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .tile {
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid var(--vz-border-color);
      
      &:hover {
        border-color: var(--vz-primary);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        
        h6 {
          color: var(--vz-primary) !important;
        }
        
        .tile-select {
          opacity: 1;
        }
      }
      
      &.selected {
        border-color: var(--vz-primary);
        background: rgba(var(--vz-primary-rgb), 0.05);
      }
    }
    
    .tile-select {
      opacity: 0;
      transition: opacity 0.2s ease;
      
      &.visible {
        opacity: 1;
      }
    }
    
    .selection-checkbox {
      width: 20px;
      height: 20px;
      border: 2px solid var(--vz-border-color);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      
      &.checked {
        background: var(--vz-primary);
        border-color: var(--vz-primary);
        color: white;
      }
    }
    
    .tile-icon {
      width: 36px;
      height: 36px;
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
    
    .tile-content {
      min-width: 0;
      
      h6 {
        font-size: 0.9375rem;
        font-weight: 600;
        transition: color 0.2s ease;
      }
    }
    
    .tile-cell {
      min-width: 80px;
      
      small {
        font-size: 0.6875rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .fw-medium {
        font-size: 0.875rem;
      }
    }
    
    .tile-actions {
      .btn {
        padding: 0.25rem 0.5rem;
        line-height: 1;
      }
    }
  `]
})
export class TilesRendererComponent {
  @Input() cards: IUniversalCardData[] = [];
  @Input() selectedIds: Set<string> = new Set();
  
  @Output() cardClick = new EventEmitter<CardClickEvent>();
  @Output() cardAction = new EventEmitter<{ card: IUniversalCardData; action: ICardAction }>();
  
  private longPressTimer: any = null;
  private isLongPress = false;
  
  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }
  
  onClick(event: MouseEvent, card: IUniversalCardData): void {
    if (this.isLongPress) {
      this.isLongPress = false;
      return;
    }
    
    this.cardClick.emit({
      card,
      ctrlKey: event.ctrlKey || event.metaKey,
      shiftKey: event.shiftKey,
      isLongPress: false,
    });
  }
  
  onMouseDown(event: MouseEvent, card: IUniversalCardData): void {
    this.longPressTimer = setTimeout(() => {
      this.isLongPress = true;
      this.cardClick.emit({
        card,
        ctrlKey: false,
        shiftKey: false,
        isLongPress: true,
      });
    }, 500);
  }
  
  onMouseUp(): void {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }
  
  onAction(card: IUniversalCardData, action: ICardAction): void {
    this.cardAction.emit({ card, action });
  }
}
