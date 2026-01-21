/**
 * Astronomy Summary Widget
 * 
 * Displays Astronomy statistics on the Hub page.
 * Clicking navigates to Astronomy Hub.
 * 
 * Can receive IUniversalTile data via HUB_TILE_DATA injection token
 * when used within HubShellComponent with custom tile rendering.
 */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AstronomyService } from '../../../../../sites.app.lets/astronomy/services/astronomy.service';
import { IUniversalTile, HUB_TILE_DATA, IHubTileRenderer, ITileBadge } from '../../../../../core/models/presentation';
import { HubTileHeaderComponent } from '../../../../../sites/ui/widgets/hub-tile-header';

@Component({
  selector: 'app-astronomy-widget',
  standalone: true,
  imports: [CommonModule, HubTileHeaderComponent],
  template: `
    <div class="widget-card card h-100" (click)="onClick()">
      <div class="card-body">
        <!-- Loading -->
        @if (astronomyService.loading()) {
          <app-hub-tile-header
            [icon]="widgetIcon"
            [iconBackground]="iconBackground"
            [title]="widgetTitle"
            [subtitle]="widgetSubtitle">
          </app-hub-tile-header>
          <div class="text-center py-3">
            <div class="spinner-border spinner-border-sm text-warning"></div>
          </div>
        }

        <!-- Loaded State - Header with stats -->
        @if (!astronomyService.loading()) {
          <app-hub-tile-header
            [icon]="widgetIcon"
            [iconBackground]="iconBackground"
            [title]="widgetTitle"
            [subtitle]="widgetSubtitle"
            [value]="totalSystems"
            valueLabel="Star systems"
            [badges]="badges">
          </app-hub-tile-header>

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
        box-shadow: 0 4px 12px rgba(var(--vz-primary-rgb), 0.15);
        border-color: var(--vz-primary);
      }
    }
    
    .widget-list-item {
      font-size: 0.875rem;
    }
  `]
})
export class AstronomyWidgetComponent implements OnInit, IHubTileRenderer {
  astronomyService = inject(AstronomyService);
  private router = inject(Router);
  
  /** Tile data from HubShell (optional - for IHubTileRenderer interface) */
  tile = inject(HUB_TILE_DATA, { optional: true }) as IUniversalTile;

  // ─────────────────────────────────────────────────────────────
  // Computed properties using tile data or defaults
  // ─────────────────────────────────────────────────────────────

  get widgetTitle(): string {
    return this.tile?.title ?? 'Astronomy';
  }

  get widgetSubtitle(): string {
    return this.tile?.subtitle ?? this.tile?.description ?? 'Star systems & planets';
  }

  get widgetIcon(): string {
    return this.tile?.icon ?? 'bx-planet';
  }

  get iconBackground(): string {
    return this.tile?.iconBackground ?? 'bg-warning-subtle text-warning';
  }

  // ─────────────────────────────────────────────────────────────
  // Stats (from service)
  // ─────────────────────────────────────────────────────────────

  get totalSystems(): number {
    return this.astronomyService.starSystems().length;
  }

  get totalPlanets(): number {
    return this.astronomyService.starSystems().reduce((sum, s) => sum + (s.planets?.length || 0), 0);
  }

  get recentSystems() {
    return this.astronomyService.starSystems().slice(0, 3);
  }

  /** Badges for the tile header */
  get badges(): ITileBadge[] {
    return [
      { text: `${this.totalPlanets} planets`, class: 'bg-info-subtle text-info' }
    ];
  }

  ngOnInit(): void {
    if (this.astronomyService.starSystems().length === 0) {
      this.astronomyService.getStarSystems().subscribe();
    }
  }

  onClick(): void {
    const route = this.tile?.config?.route ?? '/apps/astronomy';
    if (Array.isArray(route)) {
      this.router.navigate(route);
    } else {
      this.router.navigate([route]);
    }
  }
}
