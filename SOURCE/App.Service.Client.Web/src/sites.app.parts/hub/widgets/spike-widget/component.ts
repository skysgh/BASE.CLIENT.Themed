/**
 * Spike Summary Widget
 * 
 * Displays Spike statistics on the Hub page.
 * Clicking navigates to Spike Browse.
 */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { SpikeService } from '../../../../sites.app.lets/spike/services/spike.service';

@Component({
  selector: 'app-spike-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="widget-card card h-100" (click)="onClick()">
      <div class="card-body">
        <!-- Header -->
        <div class="d-flex align-items-center mb-3">
          <div class="widget-icon bg-primary-subtle text-primary">
            <i class="bx bx-bulb"></i>
          </div>
          <div class="ms-3">
            <h6 class="mb-0">Spikes</h6>
            <p class="text-muted small mb-0">Discovery items</p>
          </div>
        </div>

        <!-- Loading -->
        @if (spikeService.loading()) {
          <div class="text-center py-3">
            <div class="spinner-border spinner-border-sm text-primary"></div>
          </div>
        }

        <!-- Stats -->
        @if (!spikeService.loading()) {
          <div class="widget-stats">
            <div class="d-flex justify-content-between align-items-end">
              <div>
                <h2 class="mb-0">{{ totalCount }}</h2>
                <span class="text-muted small">Total spikes</span>
              </div>
              <div class="text-end">
                <span class="badge bg-success-subtle text-success mb-1">
                  {{ activeCount }} active
                </span>
                <br>
                <span class="badge bg-warning-subtle text-warning">
                  {{ draftCount }} drafts
                </span>
              </div>
            </div>
          </div>

          <!-- Recent Items -->
          @if (recentItems.length > 0) {
            <div class="widget-list mt-3 pt-3 border-top">
              <p class="text-muted small mb-2">Recent:</p>
              @for (item of recentItems.slice(0, 3); track item.id) {
                <div class="widget-list-item d-flex align-items-center mb-2">
                  <i class="bx bx-chevron-right text-muted me-1"></i>
                  <span class="text-truncate small">{{ item.title }}</span>
                </div>
              }
            </div>
          }
        }

        <!-- Footer -->
        <div class="widget-footer mt-3 pt-2 border-top text-end">
          <span class="text-primary small">
            View all <i class="bx bx-arrow-right"></i>
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .widget-card {
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid var(--vz-border-color);
    }
    
    .widget-card:hover {
      border-color: var(--vz-primary);
      box-shadow: 0 4px 12px rgba(var(--vz-primary-rgb), 0.15);
      transform: translateY(-2px);
    }
    
    .widget-icon {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    
    .widget-list-item {
      font-size: 0.875rem;
    }
  `]
})
export class SpikeWidgetComponent implements OnInit {
  spikeService = inject(SpikeService);
  private router = inject(Router);

  ngOnInit(): void {
    // Data loaded by service constructor
  }

  get totalCount(): number {
    return this.spikeService.spikes().length;
  }

  get activeCount(): number {
    // For now, count all as active (would filter by status)
    return this.spikeService.spikes().filter(s => (s as any).statusId !== 'archived').length;
  }

  get draftCount(): number {
    return this.spikeService.spikes().filter(s => (s as any).statusId === '1' || (s as any).statusId === 'draft').length;
  }

  get recentItems() {
    return this.spikeService.spikes().slice(0, 3);
  }

  onClick(): void {
    this.router.navigate(['/apps/spike/spikes']);
  }
}
