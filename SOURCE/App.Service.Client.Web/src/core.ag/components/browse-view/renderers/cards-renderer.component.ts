/**
 * Cards Renderer Component
 * 
 * Renders cards in a grid (3 per row on desktop).
 * Supports multi-select with visual selection state.
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { IUniversalCardData, ICardAction } from '../../../../core/models/presentation/universal-card.model';
import { CardClickEvent } from '../browse-view.component';

@Component({
  selector: 'app-cards-renderer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="browse-cards">
      <div class="row">
        @for (card of cards; track card.id) {
          <div class="col-xl-4 col-md-6 mb-3">
            <div 
              class="card universal-card h-100"
              [class.selected]="isSelected(card.id)"
              (click)="onClick($event, card)"
              (mousedown)="onMouseDown($event, card)"
              (mouseup)="onMouseUp()">
              
              <!-- Selection Indicator -->
              @if (isSelected(card.id)) {
                <div class="selection-indicator">
                  <i class="bx bx-check"></i>
                </div>
              }
              
              <div class="card-body">
                <!-- Header: Icon + Status -->
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div class="card-icon" [class]="card.iconBackground || 'bg-primary-subtle'">
                    @if (card.image) {
                      <img [src]="card.image" [alt]="card.imageAlt || card.title" class="rounded">
                    } @else if (card.initials) {
                      <span class="initials">{{ card.initials }}</span>
                    } @else {
                      <i [class]="card.icon || 'bx bx-file'"></i>
                    }
                  </div>
                  @if (card.status) {
                    <span class="badge" [class]="'bg-' + card.status.variant + '-subtle text-' + card.status.variant">
                      {{ card.status.label }}
                    </span>
                  }
                </div>
                
                <!-- Title -->
                <h5 class="card-title mb-1 text-dark">{{ card.title }}</h5>
                
                <!-- Subtitle -->
                @if (card.subtitle) {
                  <p class="card-subtitle text-muted small mb-2">{{ card.subtitle }}</p>
                }
                
                <!-- Description -->
                @if (card.description) {
                  <p class="card-description text-muted mb-3">{{ card.description }}</p>
                }
                
                <!-- Cells -->
                @if (card.cells && card.cells.length > 0) {
                  <div class="card-cells border-top pt-2">
                    @for (cell of card.cells.slice(0, 3); track cell.label) {
                      <div class="d-flex justify-content-between small mb-1">
                        <span class="text-muted">{{ cell.label }}:</span>
                        @switch (cell.type) {
                          @case ('badge') {
                            <span class="badge" [class]="'bg-' + (cell.badgeVariant || 'secondary') + '-subtle text-' + (cell.badgeVariant || 'secondary')">
                              {{ cell.value }}
                            </span>
                          }
                          @default {
                            <span class="text-dark">{{ cell.value }}</span>
                          }
                        }
                      </div>
                    }
                  </div>
                }
              </div>
              
              <!-- Card Footer with Actions -->
              @if (card.actions && card.actions.length > 0) {
                <div class="card-footer bg-transparent">
                  <div class="d-flex justify-content-end gap-2">
                    @for (action of card.actions.slice(0, 2); track action.id) {
                      @if (action.routerLink) {
                        <a [routerLink]="action.routerLink"
                           (click)="$event.stopPropagation()"
                           class="link-primary small">
                          @if (action.icon) {
                            <i [class]="action.icon + ' me-1'"></i>
                          }
                          {{ action.label }}
                        </a>
                      } @else {
                        <button 
                          type="button"
                          (click)="onAction($event, card, action)"
                          class="btn btn-link btn-sm p-0 link-primary">
                          @if (action.icon) {
                            <i [class]="action.icon + ' me-1'"></i>
                          }
                          {{ action.label }}
                        </button>
                      }
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .universal-card {
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid var(--vz-border-color);
      position: relative;
      
      &:hover {
        border-color: var(--vz-primary);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
        
        .card-title {
          color: var(--vz-primary) !important;
        }
      }
      
      &.selected {
        border-color: var(--vz-primary);
        background: rgba(var(--vz-primary-rgb), 0.05);
        box-shadow: 0 0 0 2px rgba(var(--vz-primary-rgb), 0.2);
      }
    }
    
    .selection-indicator {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      width: 24px;
      height: 24px;
      background: var(--vz-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1rem;
      z-index: 1;
    }
    
    .card-icon {
      width: 44px;
      height: 44px;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      
      i {
        font-size: 1.25rem;
        color: var(--vz-primary);
      }
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .initials {
        font-size: 1rem;
        font-weight: 600;
        color: var(--vz-primary);
      }
    }
    
    .card-title {
      font-size: 1rem;
      font-weight: 600;
      transition: color 0.2s ease;
    }
    
    .card-subtitle {
      font-size: 0.8125rem;
    }
    
    .card-description {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-size: 0.875rem;
    }
    
    .card-cells {
      font-size: 0.8125rem;
    }
  `]
})
export class CardsRendererComponent {
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
    // Start long press timer for desktop (mobile uses touch events)
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
  
  onAction(event: MouseEvent, card: IUniversalCardData, action: ICardAction): void {
    event.stopPropagation();
    event.preventDefault();
    this.cardAction.emit({ card, action });
  }
}
