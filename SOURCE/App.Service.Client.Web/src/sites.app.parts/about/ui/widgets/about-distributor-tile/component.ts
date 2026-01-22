/**
 * About Distributor Tile Component
 * 
 * A dedicated tile component for displaying Distributor information in the About hub.
 * Handles the "Direct" vs actual distributor logic.
 * Uses HubTileHeader for consistent styling and implements IHubTileRenderer.
 * 
 * Usage in HubShell:
 * ```typescript
 * tileComponents.set('distributor', AboutDistributorTileComponent);
 * ```
 */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { IUniversalTile, IHubTileRenderer, HUB_TILE_DATA } from '../../../../../core/models/presentation';
import { HubTileHeaderComponent } from '../../../../../sites/ui/widgets/hub-tile-header';
import { AboutService } from '../../../services/about.service';

@Component({
  selector: 'app-about-distributor-tile',
  standalone: true,
  imports: [CommonModule, RouterModule, HubTileHeaderComponent],
  template: `
    <div class="about-tile card h-100" 
         [class.muted]="!hasDistributor"
         [routerLink]="tile.config.route">
      <div class="card-body">
        <app-hub-tile-header
          [icon]="tile.icon"
          [iconBackground]="getIconBackground()"
          [title]="tile.title"
          [subtitle]="distributorName"
          [showValue]="false">
        </app-hub-tile-header>
        
        <p class="text-muted small mt-2 mb-0">{{ getDescription() }}</p>
        
        <div class="tile-arrow mt-2 text-end">
          <span class="text-success small">View details <i class="bx bx-chevron-right"></i></span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .about-tile {
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid var(--vz-border-color);
      
      &:hover {
        border-color: var(--vz-primary);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(var(--vz-primary-rgb), 0.15);
      }
      
      &.muted {
        opacity: 0.85;
      }
    }
    
    .tile-arrow {
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    
    .about-tile:hover .tile-arrow {
      opacity: 1;
    }
  `]
})
export class AboutDistributorTileComponent implements IHubTileRenderer {
  /** Tile data injected from HubShell */
  tile = inject(HUB_TILE_DATA);
  
  /** About service for distributor data */
  private aboutService = inject(AboutService);
  
  /** Check if there's a distributor in the chain */
  get hasDistributor(): boolean {
    return this.aboutService.hasDistributor();
  }
  
  /** Get distributor name or "Direct" */
  get distributorName(): string {
    return this.aboutService.distributor()?.name || 'Direct';
  }
  
  /** Get description based on whether distributor exists */
  getDescription(): string {
    if (this.tile.description) return this.tile.description;
    return this.hasDistributor ? 'Reseller/partner' : 'No reseller in chain';
  }
  
  /** Get icon background class */
  getIconBackground(): string {
    return this.tile.iconBackground || 'bg-success-subtle text-success';
  }
}
