/**
 * Astronomy Hub Component
 * 
 * Landing page for the Astronomy applet showing entity tiles.
 * Uses HubShellComponent for consistent hub experience.
 */
import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HubShellComponent, HubTileConfig } from '../../../../../sites/ui/widgets/hub-shell';
import { AstronomyService } from '../../../services/astronomy.service';

@Component({
  selector: 'app-astronomy-hub',
  standalone: true,
  imports: [CommonModule, RouterModule, HubShellComponent],
  template: `
    <app-hub-shell
      hubId="astronomy-hub"
      title="Astronomy"
      icon="bx-planet"
      [legacyTiles]="entityTiles()"
      (tilesReordered)="onTilesReordered($event)"
      (tileVisibilityChanged)="onTileVisibilityChanged($event)">
      <ng-container subtitle>
        Explore star systems, planets, and moons
      </ng-container>
    </app-hub-shell>
  `
})
export class AstronomyHubComponent {
  private service = inject(AstronomyService);

  /** Entity tiles with dynamic counts - routes to V2 Browse views */
  entityTiles = computed<HubTileConfig[]>(() => [
    {
      id: 'star-systems',
      title: 'Star Systems',
      icon: 'bx-sun',
      iconColor: 'warning',
      route: 'star-systems-v2',
      count: this.service.starSystemCount(),
      subtitle: 'Browse all star systems',
      visible: true,
    },
    {
      id: 'planets',
      title: 'Planets',
      icon: 'bx-planet',
      iconColor: 'info',
      route: 'planets-v2',
      count: this.service.planetCount(),
      subtitle: 'Browse all planets',
      visible: true,
    },
    {
      id: 'astronomers',
      title: 'Astronomers',
      icon: 'bx-user',
      iconColor: 'primary',
      route: 'astronomers',
      count: this.service.astronomerCount(),
      subtitle: 'Browse all astronomers',
      visible: true,
    },
  ]);

  onTilesReordered(tileIds: string[]): void {
    // TODO: Save to HubSettingsService
    console.log('[AstronomyHub] Tiles reordered:', tileIds);
  }

  onTileVisibilityChanged(event: { id: string; visible: boolean }): void {
      // TODO: Save to HubSettingsService
      console.log('[AstronomyHub] Tile visibility changed:', event);
    }
  }
