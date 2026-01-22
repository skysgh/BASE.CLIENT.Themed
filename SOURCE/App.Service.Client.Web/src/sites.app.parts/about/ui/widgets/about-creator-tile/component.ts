/**
 * About Creator Tile Component
 * 
 * A dedicated tile component for displaying Creator information in the About hub.
 * Uses HubTileHeader for consistent styling and implements IHubTileRenderer
 * for integration with HubShellComponent.
 * 
 * Usage in HubShell:
 * ```typescript
 * tileComponents.set('creator', AboutCreatorTileComponent);
 * ```
 */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { IUniversalTile, IHubTileRenderer, HUB_TILE_DATA } from '../../../../../core/models/presentation';
import { HubTileHeaderComponent } from '../../../../../sites/ui/widgets/hub-tile-header';
import { AboutService } from '../../../services/about.service';

@Component({
  selector: 'app-about-creator-tile',
  standalone: true,
  imports: [CommonModule, RouterModule, HubTileHeaderComponent],
  template: `
    <div class="about-tile card h-100" [routerLink]="tile.config.route">
      <div class="card-body">
        <app-hub-tile-header
          [icon]="tile.icon"
          [iconBackground]="getIconBackground()"
          [title]="tile.title"
          [subtitle]="creatorName"
          [showValue]="false">
        </app-hub-tile-header>
        
        <p class="text-muted small mt-2 mb-0">{{ tile.description || 'Original developer/platform owner' }}</p>
        
        <div class="tile-arrow mt-2 text-end">
          <span class="text-purple small">View details <i class="bx bx-chevron-right"></i></span>
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
export class AboutCreatorTileComponent implements IHubTileRenderer {
  /** Tile data injected from HubShell */
  tile = inject(HUB_TILE_DATA);
  
  /** About service for creator data */
  private aboutService = inject(AboutService);
  
  /** Get creator name from service */
  get creatorName(): string {
    return this.aboutService.creator()?.name || 'Unknown';
  }
  
  /** Get icon background class */
  getIconBackground(): string {
    return this.tile.iconBackground || 'bg-purple-subtle text-purple';
  }
}
