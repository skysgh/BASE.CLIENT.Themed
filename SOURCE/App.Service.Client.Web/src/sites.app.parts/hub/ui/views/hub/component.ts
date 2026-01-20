/**
 * Hub Component
 * 
 * Main hub page displaying widgets from enabled applets.
 * Widgets are dynamically rendered based on account config.
 */
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HubService } from '../../../services';
import { HubWidgetConfig } from '../../../models';
import { SpikeWidgetComponent, ActivityWidgetComponent, AstronomyWidgetComponent } from '../../widgets';

@Component({
  selector: 'app-hub',
  standalone: true,
  imports: [CommonModule, RouterModule, NgComponentOutlet, SpikeWidgetComponent, ActivityWidgetComponent, AstronomyWidgetComponent],
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
            <!-- Dynamic quick action based on default applet -->
            @if (defaultApplet()) {
              <a [routerLink]="defaultApplet()!.quickActionRoute" class="btn btn-primary">
                <i class="bx bx-plus me-1"></i>
                {{ defaultApplet()!.quickActionLabel }}
              </a>
            }
            <!-- Customize (future) -->
            <button class="btn btn-outline-secondary" disabled title="Coming soon">
              <i class="bx bx-cog"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Widget Grid - Dynamic from registered widgets -->
      <div class="row g-4">
        @for (widget of widgets(); track widget.id) {
          <div [class]="getWidgetColumnClass(widget)">
            @if (widget.component) {
              <ng-container *ngComponentOutlet="widget.component"></ng-container>
            } @else {
              <!-- Fallback placeholder if no component -->
              <div class="widget-card card h-100">
                <div class="card-body text-center py-5">
                  <div class="widget-icon mx-auto mb-3" [class]="'bg-' + (widget.appletId === 'spike' ? 'primary' : 'secondary') + '-subtle'">
                    <i [class]="widget.icon"></i>
                  </div>
                  <h6>{{ widget.title }}</h6>
                  <p class="text-muted small mb-0">Widget loading...</p>
                </div>
              </div>
            }
          </div>
        }
        
        <!-- Empty state if no widgets -->
        @if (widgets().length === 0) {
          <div class="col-12">
            <div class="alert alert-info text-center">
              <i class="bx bx-info-circle me-2"></i>
              No widgets configured. Enable applets in account settings to see widgets here.
            </div>
          </div>
        }
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
  private hubService = inject(HubService);

  // Get widgets from service (filtered by account config)
  widgets = computed(() => this.hubService.appletWidgets());
  
  // Default applet for quick action
  defaultApplet = signal<{ quickActionRoute: string; quickActionLabel: string } | null>({
    quickActionRoute: '/apps/spike/spikes/add',
    quickActionLabel: 'New Spike',
  });

  ngOnInit(): void {
    // Register built-in widgets if not already registered
    this.registerBuiltInWidgets();
  }
  
  /**
   * Register the built-in widgets
   */
  private registerBuiltInWidgets(): void {
    // Spike widget
    this.hubService.registerWidget({
      id: 'spike-summary',
      appletId: 'spike',
      title: 'Spikes',
      icon: 'bx bx-bulb',
      size: 'medium',
      order: 1,
      enabled: true,
      clickRoute: '/apps/spike',
      component: SpikeWidgetComponent,
    });
    
    // Astronomy widget
    this.hubService.registerWidget({
      id: 'astronomy-summary',
      appletId: 'astronomy',
      title: 'Astronomy',
      icon: 'bx bx-planet',
      size: 'medium',
      order: 2,
      enabled: true,
      clickRoute: '/apps/astronomy',
      component: AstronomyWidgetComponent,
    });
    
    // Activity widget (always enabled - part of core)
    this.hubService.registerWidget({
      id: 'activity-feed',
      appletId: 'spike', // Tied to spike for now, could be 'core'
      title: 'Recent Activity',
      icon: 'bx bx-time',
      size: 'medium',
      order: 10,
      enabled: true,
      component: ActivityWidgetComponent,
    });
  }
  
  /**
   * Get Bootstrap column class based on widget size
   */
  getWidgetColumnClass(widget: HubWidgetConfig): string {
    switch (widget.size) {
      case 'small':
        return 'col-12 col-md-4 col-lg-3';
      case 'large':
        return 'col-12 col-lg-8';
      case 'full':
        return 'col-12';
      case 'medium':
      default:
        return 'col-12 col-md-6 col-lg-4';
    }
  }
}
