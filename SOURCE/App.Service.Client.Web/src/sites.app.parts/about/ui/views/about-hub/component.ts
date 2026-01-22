/**
 * About Hub Component
 * 
 * Main hub showing the Creator → Distributor → Account hierarchy
 * with links to detailed views for licenses, version info, etc.
 * 
 * REFACTORED to use HubShellComponent with:
 * - Dedicated tile components for Creator, Distributor, Account
 * - Grouping support for "Distribution Chain" vs "Quick Links"
 * - Configurable gear icon (disabled by default for About)
 */
import { Component, inject, OnInit, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AboutService } from '../../../services/about.service';
import { AccountService } from '../../../../../core/services/account.service';
import { ABOUT_CONSTANTS } from '../../../constants';
import { 
  IUniversalTile, 
  ITileGroup, 
  IHubDisplayConfig,
  createTile 
} from '../../../../../core/models/presentation';
import { HubShellComponent, TileComponentMap } from '../../../../../sites/ui/widgets/hub-shell';
import { AboutCreatorTileComponent } from '../../widgets/about-creator-tile';
import { AboutDistributorTileComponent } from '../../widgets/about-distributor-tile';
import { AboutAccountTileComponent } from '../../widgets/about-account-tile';

@Component({
    selector: 'app-about-hub',
    standalone: true,
    imports: [CommonModule, RouterModule, HubShellComponent],
    template: `
      <!-- Loading State -->
      @if (aboutService.loading()) {
        <div class="about-loading text-center py-5">
          <div class="spinner-border text-primary"></div>
          <p class="text-muted mt-2">Loading...</p>
        </div>
      }
    
      <!-- Hub Shell with tiles -->
      @if (!aboutService.loading()) {
        <app-hub-shell
          hubId="about-hub"
          title="About"
          subtitle="Service information and attributions"
          icon="bx-info-circle"
          iconBackground="bg-primary-subtle"
          iconClass="text-primary"
          [showBack]="true"
          [showConfig]="false"
          [showBreadcrumbs]="true"
          [tiles]="tiles"
          [tileComponents]="tileComponentMap"
          [enableGrouping]="true"
          [groups]="tileGroups"
          tileColumnClass="col-md-6 col-lg-4">
          
          <!-- Footer Links (projected content) -->
          <div class="footer-links d-flex gap-3 flex-wrap justify-content-center text-muted small mt-4 pt-4 border-top">
            @if (aboutService.creator()?.website) {
              <a [href]="aboutService.creator()?.website" target="_blank" class="text-muted">
                <i class="bx bx-globe me-1"></i> Website
              </a>
            }
            @if (aboutService.creator()?.social?.github) {
              <a [href]="aboutService.creator()?.social?.github" target="_blank" class="text-muted">
                <i class="bx bxl-github me-1"></i> GitHub
              </a>
            }
            @if (aboutService.theme()?.urls?.themeForest) {
              <a [href]="aboutService.theme()?.urls?.themeForest" target="_blank" class="text-muted">
                <i class="bx bx-palette me-1"></i> Theme
              </a>
            }
            <a routerLink="/system/compliance/privacy-policy" class="text-muted">
              <i class="bx bx-lock me-1"></i> Privacy Policy
            </a>
            <a routerLink="/system/compliance/terms-conditions" class="text-muted">
              <i class="bx bx-file me-1"></i> Terms & Conditions
            </a>
          </div>
        </app-hub-shell>
      }
    `,
    styles: [`
      .about-loading { 
        padding: 1.5rem; 
        max-width: 1200px; 
        margin: 0 auto; 
      }
      
      .footer-links a:hover {
        color: var(--vz-primary) !important;
      }
      
      /* Custom purple color support */
      :host ::ng-deep .bg-purple-subtle { background-color: rgba(135, 114, 249, 0.1) !important; }
      :host ::ng-deep .text-purple { color: #8772f9 !important; }
    `]
})
export class AboutHubComponent implements OnInit {
  aboutService = inject(AboutService);
  private accountService = inject(AccountService);
  
  currentYear = new Date().getFullYear();

  /** Tile definitions */
  tiles: IUniversalTile[] = [];
  
  /** Map of tile IDs to custom components */
  tileComponentMap: TileComponentMap = new Map();
  
  /** Group definitions */
  tileGroups: ITileGroup[] = [
    { id: 'chain', label: 'Distribution Chain', order: 1 },
    { id: 'info', label: 'Information', order: 2 }
  ];

  ngOnInit(): void {
    this.buildTileComponentMap();
    this.buildTiles();
  }

  /** Register custom tile components */
  private buildTileComponentMap(): void {
    this.tileComponentMap.set('creator', AboutCreatorTileComponent);
    this.tileComponentMap.set('distributor', AboutDistributorTileComponent);
    this.tileComponentMap.set('account', AboutAccountTileComponent);
  }

  /** Build tile definitions */
  private buildTiles(): void {
    this.tiles = [
      // Distribution Chain group
      createTile('creator', 'Creator', 'bx-code-alt', 'creator', {
        iconBackground: 'bg-purple-subtle text-purple',
        description: 'Original developer/platform owner',
        config: { route: 'creator', visible: true, order: 0, groupId: 'chain' }
      }),
      createTile('distributor', 'Distributor', 'bx-store', 'distributor', {
        iconBackground: 'bg-success-subtle text-success',
        description: 'Reseller/partner',
        config: { route: 'distributor', visible: true, order: 1, groupId: 'chain' }
      }),
      createTile('account', 'Account', 'bx-building', 'account', {
        iconBackground: 'bg-warning-subtle text-warning',
        description: 'Your organization/tenant',
        config: { route: 'account', visible: true, order: 2, groupId: 'chain' }
      }),
      
      // Info group - these use standard HubTile rendering
      createTile('version', 'Version', 'bx-chip', 'version', {
        iconBackground: 'bg-primary-subtle text-primary',
        subtitle: this.aboutService.version()?.version || '1.0.0',
        config: { 
          route: 'version', 
          visible: true, 
          order: 0, 
          groupId: 'info',
          badges: this.getVersionBadges()
        }
      }),
      createTile('licenses', 'Open Source', 'bx-file', 'licenses', {
        iconBackground: 'bg-info-subtle text-info',
        subtitle: 'Third-party licenses',
        value: this.aboutService.licenseCount(),
        valueLabel: 'packages',
        config: { route: 'licenses', visible: true, order: 1, groupId: 'info' }
      }),
      createTile('theme', 'UI Theme', 'bx-palette', 'theme', {
        iconBackground: 'bg-purple-subtle text-purple',
        subtitle: this.aboutService.theme()?.name || 'Unknown',
        config: { 
          route: '', // Non-navigable
          visible: true, 
          order: 2, 
          groupId: 'info',
          badges: this.getThemeBadges()
        }
      }),
      createTile('copyright', 'Copyright', 'bx-copyright', 'copyright', {
        iconBackground: 'bg-secondary-subtle text-secondary',
        subtitle: this.aboutService.creator()?.copyright || `© ${this.currentYear} All rights reserved.`,
        config: { 
          route: '', // Non-navigable
          visible: true, 
          order: 3, 
          groupId: 'info' 
        }
      })
    ];
  }

  /** Helper to create version badges */
  private getVersionBadges(): { text: string; class: string }[] {
    const env = this.aboutService.version()?.environment;
    if (!env) return [];
    return [{ 
      text: env, 
      class: env === 'production' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning' 
    }];
  }

  /** Helper to create theme version badges */
  private getThemeBadges(): { text: string; class: string }[] {
    const version = this.aboutService.theme()?.version;
    return version ? [{ text: version, class: 'bg-secondary-subtle text-secondary' }] : [];
  }
}
