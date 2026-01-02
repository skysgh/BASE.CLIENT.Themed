/**
 * List Renderer Component
 * 
 * Simple list view with selection support.
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { IUniversalCardData } from '../../../../../core/models/presentation/universal-card.model';
import { CardClickEvent } from '../browse-view.component';

@Component({
  selector: 'app-list-renderer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="browse-list">
      <div class="list-group">
        @for (card of cards; track card.id) {
          <div 
            class="list-group-item list-group-item-action d-flex align-items-center"
            [class.active]="isSelected(card.id)"
            (click)="onClick($event, card)">
            
            <!-- Selection Checkbox -->
            <div class="list-select me-2" [class.visible]="isSelected(card.id)">
              <div class="selection-checkbox" [class.checked]="isSelected(card.id)">
                @if (isSelected(card.id)) {
                  <i class="bx bx-check"></i>
                }
              </div>
            </div>
            
            <!-- Icon -->
            <div class="list-icon me-3" [class]="card.iconBackground || 'bg-primary-subtle'">
              @if (card.initials) {
                <span class="initials-sm">{{ card.initials }}</span>
              } @else {
                <i [class]="card.icon || 'bx bx-file'"></i>
              }
            </div>
            
            <!-- Content -->
            <div class="flex-grow-1">
              <h6 class="mb-0">{{ card.title }}</h6>
              <small class="text-muted">{{ card.subtitle || card.description }}</small>
            </div>
            
            <!-- Status -->
            @if (card.status) {
              <span class="badge me-2" [class]="'bg-' + card.status.variant + '-subtle text-' + card.status.variant">
                {{ card.status.label }}
              </span>
            }
            
            <!-- View Icon -->
            <i class="bx bx-show text-muted"></i>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .list-group-item {
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        .list-icon {
          transform: scale(1.1);
        }
        
        h6 {
          color: var(--vz-primary);
        }
        
        .list-select {
          opacity: 1;
        }
      }
      
      &.active {
        background-color: rgba(var(--vz-primary-rgb), 0.1);
        border-color: var(--vz-primary);
        
        h6 {
          color: var(--vz-primary);
        }
      }
    }
    
    .list-select {
      opacity: 0;
      transition: opacity 0.2s ease;
      
      &.visible {
        opacity: 1;
      }
    }
    
    .selection-checkbox {
      width: 18px;
      height: 18px;
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
        font-size: 0.75rem;
      }
    }
    
    .list-icon {
      width: 32px;
      height: 32px;
      border-radius: 0.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: transform 0.2s ease;
      
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
  `]
})
export class ListRendererComponent {
  @Input() cards: IUniversalCardData[] = [];
  @Input() selectedIds: Set<string> = new Set();
  
  @Output() cardClick = new EventEmitter<CardClickEvent>();
  
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
}
