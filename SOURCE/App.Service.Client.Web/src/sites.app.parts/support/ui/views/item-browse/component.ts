/**
 * Item Browse Component (My Items)
 * 
 * BREAD: Browse view for user's support items.
 * Uses Universal Search pattern with multiple view renderers.
 */
import { Component, inject, OnInit, OnDestroy, effect, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { SupportItemService } from '../../../services';
import { SupportItemCardBroker } from '../../../brokers';
import { SupportItemViewModel } from '../../../models';
import { SUPPORT_ITEM_TYPES, SUPPORT_STATUSES } from '../../../constants';
import { UniversalSearchService, SearchStateManager } from '../../../../../core/services/universal-search.service';
import { CardBrokerRegistry } from '../../../../../core/models/presentation/card-broker.model';
import { IUniversalCardData, ICardAction } from '../../../../../core/models/presentation/universal-card.model';

type ViewMode = 'cards' | 'list' | 'board';

@Component({
  selector: 'app-item-browse',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="item-browse">
      <!-- Top Navigation Bar -->
      <div class="top-nav-bar mb-3 d-flex justify-content-between align-items-center">
        <a routerLink=".." class="btn btn-primary">
          <i class="bx bx-arrow-back me-1"></i>
          Back to Support
        </a>
        
        <div class="d-flex gap-2 align-items-center">
          <!-- View Mode Toggle -->
          <div class="btn-group btn-group-sm">
            <button
              type="button"
              class="btn"
              [class.btn-secondary]="viewMode === 'cards'"
              [class.btn-outline-secondary]="viewMode !== 'cards'"
              (click)="setViewMode('cards')"
              title="Cards">
              <i class="bx bx-grid-alt"></i>
            </button>
            <button
              type="button"
              class="btn"
              [class.btn-secondary]="viewMode === 'list'"
              [class.btn-outline-secondary]="viewMode !== 'list'"
              (click)="setViewMode('list')"
              title="List">
              <i class="bx bx-list-ul"></i>
            </button>
            <button
              type="button"
              class="btn"
              [class.btn-secondary]="viewMode === 'board'"
              [class.btn-outline-secondary]="viewMode !== 'board'"
              (click)="setViewMode('board')"
              title="Board (Progress View)">
              <i class="bx bx-columns"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Header -->
      <div class="browse-header mb-4">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h4 class="mb-1">
              <i class="bx bx-list-ul me-2"></i>
              My Submissions
            </h4>
            <p class="text-muted mb-0">
              {{ supportService.stats().totalItems }} items 
              ({{ supportService.stats().openItems }} open)
            </p>
          </div>
          
          <div class="d-flex gap-2">
            <a routerLink="../new/issue" class="btn btn-danger btn-sm">
              <i class="bx bx-bug me-1"></i>
              Report Issue
            </a>
            <a routerLink="../new/idea" class="btn btn-primary btn-sm">
              <i class="bx bx-bulb me-1"></i>
              Share Idea
            </a>
          </div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <ul class="nav nav-tabs mb-4">
        <li class="nav-item">
          <a 
            class="nav-link" 
            [class.active]="filter === 'all'"
            (click)="setFilter('all')"
            style="cursor: pointer;">
            All ({{ supportService.stats().totalItems }})
          </a>
        </li>
        <li class="nav-item">
          <a 
            class="nav-link" 
            [class.active]="filter === 'open'"
            (click)="setFilter('open')"
            style="cursor: pointer;">
            Open ({{ supportService.stats().openItems }})
          </a>
        </li>
        <li class="nav-item">
          <a 
            class="nav-link" 
            [class.active]="filter === 'issues'"
            (click)="setFilter('issues')"
            style="cursor: pointer;">
            <i class="bx bx-bug me-1"></i>
            Issues ({{ supportService.stats().issueCount }})
          </a>
        </li>
        <li class="nav-item">
          <a 
            class="nav-link" 
            [class.active]="filter === 'ideas'"
            (click)="setFilter('ideas')"
            style="cursor: pointer;">
            <i class="bx bx-bulb me-1"></i>
            Ideas ({{ supportService.stats().ideaCount }})
          </a>
        </li>
      </ul>

      <!-- Loading -->
      @if (supportService.loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>
      }

      <!-- Empty State -->
      @if (!supportService.loading() && filteredItems.length === 0) {
        <div class="text-center py-5">
          <i class="bx bx-inbox display-1 text-muted"></i>
          <h5 class="mt-3">No Items Found</h5>
          <p class="text-muted">You haven't submitted any support requests yet.</p>
          <div class="d-flex justify-content-center gap-2">
            <a routerLink="../new/issue" class="btn btn-danger">
              <i class="bx bx-bug me-1"></i>
              Report Issue
            </a>
            <a routerLink="../new/idea" class="btn btn-primary">
              <i class="bx bx-bulb me-1"></i>
              Share Idea
            </a>
          </div>
        </div>
      }

      <!-- Cards View -->
      @if (!supportService.loading() && viewMode === 'cards' && filteredItems.length > 0) {
        <div class="row">
          @for (item of filteredItems; track item.id) {
            <div class="col-md-6 col-lg-4 mb-3">
              <div class="card h-100 item-card" [routerLink]="['../item', item.id]" style="cursor: pointer;">
                <div class="card-body">
                  <!-- Header -->
                  <div class="d-flex justify-content-between align-items-start mb-3">
                    <div class="item-type-icon" [style.background-color]="item.typeColor + '20'">
                      <i class="bx {{ item.typeIcon }}" [style.color]="item.typeColor"></i>
                    </div>
                    <span class="badge" [class]="'bg-' + getStatusVariant(item.status) + '-subtle text-' + getStatusVariant(item.status)">
                      {{ item.statusName }}
                    </span>
                  </div>
                  
                  <!-- Content -->
                  <h6 class="card-title mb-2">{{ item.title }}</h6>
                  <p class="text-muted small mb-3 text-truncate-2">{{ item.description }}</p>
                  
                  <!-- Progress -->
                  <div class="progress mb-2" style="height: 4px;">
                    <div 
                      class="progress-bar bg-success" 
                      [style.width.%]="item.progressPercent">
                    </div>
                  </div>
                  
                  <!-- Meta -->
                  <div class="d-flex justify-content-between align-items-center small text-muted">
                    <span>{{ item.ageLabel }}</span>
                    <span class="badge" [class]="'bg-' + getPriorityVariant(item.priority) + '-subtle text-' + getPriorityVariant(item.priority)">
                      {{ item.priorityName }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- List View -->
      @if (!supportService.loading() && viewMode === 'list' && filteredItems.length > 0) {
        <div class="list-group">
          @for (item of filteredItems; track item.id) {
            <a 
              [routerLink]="['../item', item.id]"
              class="list-group-item list-group-item-action">
              <div class="d-flex align-items-center">
                <div class="item-type-icon me-3" [style.background-color]="item.typeColor + '20'">
                  <i class="bx {{ item.typeIcon }}" [style.color]="item.typeColor"></i>
                </div>
                <div class="flex-grow-1">
                  <div class="d-flex justify-content-between align-items-start">
                    <h6 class="mb-1">{{ item.title }}</h6>
                    <span class="badge ms-2" [class]="'bg-' + getStatusVariant(item.status) + '-subtle text-' + getStatusVariant(item.status)">
                      {{ item.statusName }}
                    </span>
                  </div>
                  <p class="text-muted small mb-1 text-truncate">{{ item.description }}</p>
                  <div class="d-flex gap-3 small text-muted">
                    <span>{{ item.ageLabel }}</span>
                    <span>Priority: {{ item.priorityName }}</span>
                    @if (item.category) {
                      <span>{{ item.category }}</span>
                    }
                  </div>
                </div>
                <div class="progress-indicator ms-3" style="width: 80px;">
                  <div class="progress" style="height: 4px;">
                    <div 
                      class="progress-bar bg-success" 
                      [style.width.%]="item.progressPercent">
                    </div>
                  </div>
                  <div class="text-muted text-center small mt-1">{{ item.progressPercent }}%</div>
                </div>
              </div>
            </a>
          }
        </div>
      }

      <!-- Board View (Read-Only Kanban) -->
      @if (!supportService.loading() && viewMode === 'board' && filteredItems.length > 0) {
        <div class="board-view">
          <div class="row">
            @for (status of statuses; track status.id) {
              <div class="col">
                <div class="board-column">
                  <div class="column-header" [style.border-top-color]="status.color">
                    <h6 class="mb-0">
                      <i class="bx {{ status.icon }} me-1" [style.color]="status.color"></i>
                      {{ status.name }}
                    </h6>
                    <span class="badge bg-light text-dark">
                      {{ getItemsForStatus(status.id).length }}
                    </span>
                  </div>
                  <div class="column-body">
                    @for (item of getItemsForStatus(status.id); track item.id) {
                      <div class="board-card" [routerLink]="['../item', item.id]">
                        <div class="d-flex align-items-center mb-2">
                          <i class="bx {{ item.typeIcon }} me-2" [style.color]="item.typeColor"></i>
                          <span class="badge" [class]="'bg-' + getPriorityVariant(item.priority) + '-subtle text-' + getPriorityVariant(item.priority)">
                            {{ item.priorityName }}
                          </span>
                        </div>
                        <h6 class="mb-1 small">{{ item.title }}</h6>
                        <div class="text-muted small">{{ item.ageLabel }}</div>
                      </div>
                    }
                    @if (getItemsForStatus(status.id).length === 0) {
                      <div class="text-center text-muted small py-3">
                        No items
                      </div>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .item-browse {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .item-card {
      transition: all 0.2s ease;
    }
    .item-card:hover {
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    .item-type-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }
    
    .text-truncate-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    /* Board View */
    .board-view {
      overflow-x: auto;
    }
    .board-column {
      background: var(--vz-light);
      border-radius: 8px;
      min-height: 400px;
    }
    .column-header {
      padding: 1rem;
      border-top: 3px solid;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .column-body {
      padding: 0.5rem;
    }
    .board-card {
      background: white;
      border-radius: 6px;
      padding: 0.75rem;
      margin-bottom: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid var(--vz-border-color);
    }
    .board-card:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
  `]
})
export class ItemBrowseComponent implements OnInit {
  supportService = inject(SupportItemService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  viewMode: ViewMode = 'cards';
  filter: 'all' | 'open' | 'issues' | 'ideas' = 'all';
  statuses = SUPPORT_STATUSES;

  ngOnInit(): void {
    this.supportService.refresh();
  }

  get filteredItems(): SupportItemViewModel[] {
    const items = this.supportService.items();
    switch (this.filter) {
      case 'open':
        return items.filter(i => i.isOpen);
      case 'issues':
        return items.filter(i => i.type === 'issue');
      case 'ideas':
        return items.filter(i => i.type === 'idea');
      default:
        return items;
    }
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
  }

  setFilter(filter: 'all' | 'open' | 'issues' | 'ideas'): void {
    this.filter = filter;
  }

  getItemsForStatus(statusId: string): SupportItemViewModel[] {
    return this.filteredItems.filter(i => i.status === statusId);
  }

  getStatusVariant(status: string): string {
    switch (status) {
      case 'new': return 'secondary';
      case 'triaged': return 'info';
      case 'in-progress': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'dark';
      default: return 'secondary';
    }
  }

  getPriorityVariant(priority: string): string {
    switch (priority) {
      case 'low': return 'secondary';
      case 'medium': return 'info';
      case 'high': return 'warning';
      case 'critical': return 'danger';
      default: return 'secondary';
    }
  }
}
