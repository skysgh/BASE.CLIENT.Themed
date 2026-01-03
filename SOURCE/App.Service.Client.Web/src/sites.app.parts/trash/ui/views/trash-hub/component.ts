/**
 * Trash Hub Component
 * 
 * System-level trash view showing all deleted items from all entity types.
 */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TrashService, IDeletedItem } from '../../../services/trash.service';
import { NavigationService } from '../../../../../core/services/navigation.service';

@Component({
  selector: 'app-trash-hub',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="trash-hub">
      <!-- Header -->
      <div class="page-header mb-4">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <div class="d-flex align-items-center gap-3">
              <div class="type-icon bg-secondary-subtle">
                <i class="bx bx-trash text-secondary"></i>
              </div>
              <div>
                <h4 class="mb-1">Trash</h4>
                <p class="text-muted mb-0">
                  {{ trashService.count() }} deleted items
                </p>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="d-flex gap-2 align-items-center">
            <a [routerLink]="hubRoute" class="btn btn-outline-secondary">
              <i class="bx bx-arrow-back me-1"></i>
              Back to Hub
            </a>
            @if (!trashService.isEmpty()) {
              <button 
                type="button" 
                class="btn btn-outline-danger"
                (click)="emptyTrash()"
                [disabled]="trashService.loading()">
                <i class="bx bx-trash me-1"></i>
                Empty Trash
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Warning Banner -->
      @if (!trashService.isEmpty()) {
        <div class="alert alert-warning d-flex align-items-center mb-4">
          <i class="bx bx-info-circle fs-20 me-2"></i>
          <div>
            Items in trash will be permanently deleted after 30 days.
            Restore items you want to keep.
          </div>
        </div>
      }

      <!-- Loading -->
      @if (trashService.loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      }

      <!-- Empty State -->
      @if (!trashService.loading() && trashService.isEmpty()) {
        <div class="text-center py-5">
          <div class="empty-icon mb-3">
            <i class="bx bx-trash display-1 text-muted"></i>
          </div>
          <h5 class="text-muted">Trash is Empty</h5>
          <p class="text-muted mb-0">
            Deleted items will appear here
          </p>
        </div>
      }

      <!-- Deleted Items List -->
      @if (!trashService.loading() && !trashService.isEmpty()) {
        <div class="deleted-items">
          @for (item of trashService.deletedItems(); track item.card.id) {
            <div class="card mb-2 deleted-item">
              <div class="card-body py-2 px-3">
                <div class="d-flex align-items-center gap-3">
                  <!-- Entity Type Badge -->
                  <div class="item-type-badge">
                    <span class="badge bg-secondary-subtle text-secondary">
                      {{ item.entityLabel }}
                    </span>
                  </div>
                  
                  <!-- Icon -->
                  <div class="item-icon" [class]="item.card.iconBackground || 'bg-secondary-subtle'">
                    @if (item.card.initials) {
                      <span class="initials-sm">{{ item.card.initials }}</span>
                    } @else {
                      <i [class]="item.card.icon || 'bx bx-file'"></i>
                    }
                  </div>
                  
                  <!-- Content -->
                  <div class="item-content flex-grow-1 min-width-0">
                    <h6 class="mb-0 text-truncate">{{ item.card.title }}</h6>
                    @if (item.card.subtitle || item.card.description) {
                      <small class="text-muted text-truncate d-block">
                        {{ item.card.subtitle || item.card.description }}
                      </small>
                    }
                  </div>
                  
                  <!-- Deleted At -->
                  @if (item.deletedAt) {
                    <div class="deleted-at text-muted small text-nowrap">
                      Deleted {{ formatDeletedAt(item.deletedAt) }}
                    </div>
                  }
                  
                  <!-- Actions -->
                  <div class="item-actions d-flex gap-2">
                    <button 
                      type="button" 
                      class="btn btn-sm btn-outline-success"
                      (click)="restore(item)"
                      title="Restore">
                      <i class="bx bx-undo me-1"></i>
                      Restore
                    </button>
                    <button 
                      type="button" 
                      class="btn btn-sm btn-outline-danger"
                      (click)="deletePermanently(item)"
                      title="Delete Forever">
                      <i class="bx bx-x"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Error -->
      @if (trashService.error()) {
        <div class="alert alert-danger mt-3">
          {{ trashService.error() }}
        </div>
      }
    </div>
  `,
  styles: [`
    .trash-hub {
      padding: 1.5rem;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .type-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
    }
    
    .deleted-item {
      transition: all 0.2s ease;
      border: 1px solid var(--vz-border-color);
      opacity: 0.85;
      
      &:hover {
        opacity: 1;
        border-color: var(--vz-secondary);
      }
    }
    
    .item-icon {
      width: 36px;
      height: 36px;
      border-radius: 0.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      
      i {
        font-size: 1rem;
      }
      
      .initials-sm {
        font-size: 0.75rem;
        font-weight: 600;
      }
    }
    
    .item-type-badge {
      min-width: 70px;
    }
    
    .item-content {
      min-width: 0;
      
      h6 {
        font-size: 0.9375rem;
      }
    }
    
    .empty-icon {
      opacity: 0.5;
    }
  `]
})
export class TrashHubComponent implements OnInit {
  trashService = inject(TrashService);
  private navService = inject(NavigationService);
  
  // Account-aware route to hub
  hubRoute: string = '';
  
  ngOnInit(): void {
    this.hubRoute = this.navService.getUrl('apps/system/hub');
    this.trashService.loadDeletedItems();
  }
  
  restore(item: IDeletedItem): void {
    this.trashService.restore(item).subscribe(success => {
      if (success) {
        console.log(`[Trash] Restored ${item.entityType}: ${item.card.id}`);
      }
    });
  }
  
  deletePermanently(item: IDeletedItem): void {
    if (confirm(`Permanently delete "${item.card.title}"? This cannot be undone.`)) {
      this.trashService.deletePermanently(item).subscribe(success => {
        if (success) {
          console.log(`[Trash] Permanently deleted ${item.entityType}: ${item.card.id}`);
        }
      });
    }
  }
  
  emptyTrash(): void {
    if (confirm('Permanently delete all items in trash? This cannot be undone.')) {
      this.trashService.emptyTrash().subscribe(success => {
        if (success) {
          console.log('[Trash] Emptied trash');
        }
      });
    }
  }
  
  formatDeletedAt(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  }
}
