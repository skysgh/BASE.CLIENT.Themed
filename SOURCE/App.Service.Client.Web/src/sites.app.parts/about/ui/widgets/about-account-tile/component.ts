/**
 * About Account Tile Component
 * 
 * A dedicated tile component for displaying Account information in the About hub.
 * Uses HubTileHeader for consistent styling and implements IHubTileRenderer.
 * 
 * Usage in HubShell:
 * ```typescript
 * tileComponents.set('account', AboutAccountTileComponent);
 * ```
 */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { IUniversalTile, IHubTileRenderer, HUB_TILE_DATA } from '../../../../../core/models/presentation';
import { HubTileHeaderComponent } from '../../../../../sites/ui/widgets/hub-tile-header';
import { AccountService } from '../../../../../core/services/account.service';

@Component({
  selector: 'app-about-account-tile',
  standalone: true,
  imports: [CommonModule, RouterModule, HubTileHeaderComponent],
  template: `
    <div class="about-tile card h-100" [routerLink]="tile.config.route">
      <div class="card-body">
        <app-hub-tile-header
          [icon]="tile.icon"
          [iconBackground]="getIconBackground()"
          [title]="tile.title"
          [subtitle]="accountName"
          [showValue]="false">
        </app-hub-tile-header>
        
        <p class="text-muted small mt-2 mb-0">{{ tile.description || 'Your organization/tenant' }}</p>
        
        <div class="tile-arrow mt-2 text-end">
          <span class="text-warning small">View details <i class="bx bx-chevron-right"></i></span>
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
export class AboutAccountTileComponent implements IHubTileRenderer {
  /** Tile data injected from HubShell */
  tile = inject(HUB_TILE_DATA);
  
  /** Account service for account data */
  private accountService = inject(AccountService);
  
  /** Get account name */
  get accountName(): string {
    const config = this.accountService.getCurrentConfig();
    return config?.name || 'Current Organization';
  }
  
  /** Get icon background class */
  getIconBackground(): string {
    return this.tile.iconBackground || 'bg-warning-subtle text-warning';
  }
}
