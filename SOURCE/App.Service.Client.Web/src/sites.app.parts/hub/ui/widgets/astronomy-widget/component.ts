/**
 * Astronomy Summary Widget
 * 
 * Displays Astronomy statistics on the Hub page.
 * Clicking navigates to Astronomy Hub.
 */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AstronomyService } from '../../../../../sites.app.lets/astronomy/services/astronomy.service';

@Component({
  selector: 'app-astronomy-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="widget-card card h-100" (click)="onClick()">
      <div class="card-body">
        <!-- Header -->
        <div class="d-flex align-items-center mb-3">
          <div class="widget-icon bg-warning-subtle text-warning">
            <i class="bx bx-planet"></i>
          </div>
          <div class="ms-3">
            <h6 class="mb-0">Astronomy</h6>
            <p class="text-muted small mb-0">Star systems & planets</p>
          </div>
        </div>

        <!-- Loading -->
        @if (astronomyService.loading()) {
          <div class="text-center py-3">
            <div class="spinner-border spinner-border-sm text-warning"></div>
          </div>
        }

        <!-- Stats -->
        @if (!astronomyService.loading()) {
          <div class="widget-stats">
            <div class="d-flex justify-content-between align-items-end">
              <div>
                <h2 class="mb-0">{{ totalSystems }}</h2>
                <span class="text-muted small">Star systems</span>
              </div>
              <div class="text-end">
                <span class="badge bg-info-subtle text-info mb-1">
                  {{ totalPlanets }} planets
                </span>
              </div>
            </div>
          </div>

          <!-- Recent Items -->
          @if (recentSystems.length > 0) {
            <div class="widget-list mt-3 pt-3 border-top">
              <p class="text-muted small mb-2">Recent:</p>
              @for (system of recentSystems.slice(0, 3); track system.id) {
                <div class="widget-list-item d-flex align-items-center mb-2">
                  <i class="bx bx-chevron-right text-muted me-1"></i>
                  <span class="text-truncate small">{{ system.name }}</span>
                </div>
              }
            </div>
          }
        }

        <!-- Footer -->
        <div class="widget-footer mt-3 pt-2 border-top text-end">
          <span class="text-warning small">
            View all <i class="bx bx-arrow-right"></i>
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .widget-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      border: 1px solid var(--vz-border-color);
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }
    
    .widget-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }
    
    .widget-list-item {
      font-size: 0.875rem;
    }
  `]
})
export class AstronomyWidgetComponent implements OnInit {
  astronomyService = inject(AstronomyService);
  private router = inject(Router);

  get totalSystems(): number {
    return this.astronomyService.starSystems().length;
  }

  get totalPlanets(): number {
    // Sum planets across all systems (if we had that data)
    // For now, just show a placeholder
    return this.astronomyService.starSystems().reduce((sum, s) => sum + (s.planets?.length || 0), 0);
  }

  get recentSystems() {
    return this.astronomyService.starSystems().slice(0, 3);
  }

  ngOnInit(): void {
    // Load star systems if not already loaded
    if (this.astronomyService.starSystems().length === 0) {
      this.astronomyService.getStarSystems().subscribe();
    }
  }

  onClick(): void {
    this.router.navigate(['/apps/astronomy']);
  }
}
