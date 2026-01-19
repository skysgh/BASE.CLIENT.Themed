/**
 * Hub Component
 * 
 * Main hub page displaying widgets from enabled applets.
 */
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HubService } from '../../../services';
import { SpikeWidgetComponent, ActivityWidgetComponent, AstronomyWidgetComponent } from '../../widgets';

@Component({
  selector: 'app-hub',
  standalone: true,
  imports: [CommonModule, RouterModule, SpikeWidgetComponent, ActivityWidgetComponent, AstronomyWidgetComponent],
  template: `
    <div class="hub-page">
      <!-- Header with Quick Actions on Right -->
      <div class="hub-header mb-4">
        <div class="d-flex justify-content-between align-items-start">
          <!-- Title -->
          <div>
            <h4 class="mb-1">
              <i class="bx bx-home-alt me-2 text-primary"></i>
              Hub
            </h4>
            <p class="text-muted mb-0">
              Welcome back! Here's an overview of your workspace.
            </p>
          </div>
          
          <!-- Quick Actions (Right Side) -->
          <div class="d-flex gap-2 align-items-center">
            <a routerLink="/apps/spike/spikes/add" class="btn btn-primary">
              <i class="bx bx-plus me-1"></i>
              New Spike
            </a>
            <!-- Customize (future) -->
            <button class="btn btn-outline-secondary" disabled title="Coming soon">
              <i class="bx bx-cog"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Widget Grid -->
      <div class="row g-4">
        <!-- Spike Widget -->
        <div class="col-12 col-md-6 col-lg-4">
          <app-spike-widget></app-spike-widget>
        </div>

        <!-- Astronomy Widget -->
        <div class="col-12 col-md-6 col-lg-4">
          <app-astronomy-widget></app-astronomy-widget>
        </div>

        <!-- Activity Widget -->
        <div class="col-12 col-md-6 col-lg-4">
          <app-activity-widget></app-activity-widget>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hub-page {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .widget-card {
      border: 1px solid var(--vz-border-color);
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
  `]
})
export class HubComponent implements OnInit {
  hubService = inject(HubService);

  ngOnInit(): void {
    // Widgets register themselves via HubService
  }
}
