/**
 * About Hub Component
 * 
 * Main hub showing the Creator → Distributor → Account hierarchy
 * with links to detailed views for licenses, version info, etc.
 * Uses standard PageHeader and HubTileHeader for consistent styling.
 */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AboutService } from '../../../services/about.service';
import { AccountService } from '../../../../../core/services/account.service';
import { ABOUT_CONSTANTS } from '../../../constants';
import { PageHeaderComponent } from '../../../../../sites/ui/widgets/page-header';
import { HubTileHeaderComponent } from '../../../../../sites/ui/widgets/hub-tile-header';

@Component({
    selector: 'app-about-hub',
    standalone: true,
    imports: [CommonModule, RouterModule, PageHeaderComponent, HubTileHeaderComponent],
    template: `
    <div class="about-hub">
      <!-- Standard Page Header -->
      <app-page-header 
        title="About"
        icon="bx-info-circle"
        iconBackground="bg-primary-subtle"
        iconClass="text-primary"
        [showBack]="true"
        [showBreadcrumb]="true">
        <ng-container subtitle>Service information and attributions</ng-container>
      </app-page-header>
    
      <!-- Loading State -->
      @if (aboutService.loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary"></div>
          <p class="text-muted mt-2">Loading...</p>
        </div>
      }
    
      <!-- Content -->
      @if (!aboutService.loading()) {
        <div>
          <!-- Distribution Hierarchy - as tiles using hub-tile-header -->
          <div class="row g-4 mb-4">
            <!-- Creator Tile -->
            <div class="col-md-6 col-lg-4">
              <div class="hierarchy-tile card h-100" routerLink="creator">
                <div class="card-body">
                  <app-hub-tile-header
                    icon="bx-code-alt"
                    iconBackground="bg-purple-subtle text-purple"
                    title="Creator"
                    [subtitle]="aboutService.creator()?.name || 'Unknown'"
                    [showValue]="false">
                  </app-hub-tile-header>
                  <p class="text-muted small mt-2 mb-0">Original developer/platform owner</p>
                  <div class="tile-arrow mt-2 text-end">
                    <span class="text-primary small">View details <i class="bx bx-chevron-right"></i></span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Distributor Tile -->
            <div class="col-md-6 col-lg-4">
              <div class="hierarchy-tile card h-100" 
                   [class.muted]="!aboutService.hasDistributor()"
                   routerLink="distributor">
                <div class="card-body">
                  <app-hub-tile-header
                    icon="bx-store"
                    iconBackground="bg-success-subtle text-success"
                    title="Distributor"
                    [subtitle]="aboutService.distributor()?.name || 'Direct'"
                    [showValue]="false">
                  </app-hub-tile-header>
                  <p class="text-muted small mt-2 mb-0">
                    {{ aboutService.hasDistributor() ? 'Reseller/partner' : 'No reseller in chain' }}
                  </p>
                  <div class="tile-arrow mt-2 text-end">
                    <span class="text-success small">View details <i class="bx bx-chevron-right"></i></span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Account Tile -->
            <div class="col-md-6 col-lg-4">
              <div class="hierarchy-tile card h-100" routerLink="account">
                <div class="card-body">
                  <app-hub-tile-header
                    icon="bx-building"
                    iconBackground="bg-warning-subtle text-warning"
                    title="Account"
                    [subtitle]="accountName || 'Current Organization'"
                    [showValue]="false">
                  </app-hub-tile-header>
                  <p class="text-muted small mt-2 mb-0">Your organization/tenant</p>
                  <div class="tile-arrow mt-2 text-end">
                    <span class="text-warning small">View details <i class="bx bx-chevron-right"></i></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Quick Links Row -->
          <div class="row g-4">
            <!-- Version Info -->
            <div class="col-md-6 col-lg-3">
              <div class="hierarchy-tile card h-100" routerLink="version">
                <div class="card-body">
                  <app-hub-tile-header
                    icon="bx-chip"
                    iconBackground="bg-primary-subtle text-primary"
                    title="Version"
                    [subtitle]="aboutService.version()?.version || '1.0.0'"
                    [showValue]="false"
                    [badges]="[{ text: aboutService.version()?.environment || 'development', class: aboutService.version()?.environment === 'production' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning' }]">
                  </app-hub-tile-header>
                </div>
              </div>
            </div>
            
            <!-- Licenses -->
            <div class="col-md-6 col-lg-3">
              <div class="hierarchy-tile card h-100" routerLink="licenses">
                <div class="card-body">
                  <app-hub-tile-header
                    icon="bx-file"
                    iconBackground="bg-info-subtle text-info"
                    title="Open Source"
                    subtitle="Third-party licenses"
                    [value]="aboutService.licenseCount()"
                    valueLabel="packages">
                  </app-hub-tile-header>
                </div>
              </div>
            </div>
            
            <!-- Theme Info -->
            <div class="col-md-6 col-lg-3">
              <div class="card h-100">
                <div class="card-body">
            <app-hub-tile-header
                    icon="bx-palette"
                    iconBackground="bg-purple-subtle text-purple"
                    title="UI Theme"
                    [subtitle]="aboutService.theme()?.name || 'Unknown'"
                    [showValue]="false"
                    [badges]="getThemeBadges()">
                  </app-hub-tile-header>
                </div>
              </div>
            </div>
            
            <!-- Copyright -->
            <div class="col-md-6 col-lg-3">
              <div class="card h-100">
                <div class="card-body">
                  <app-hub-tile-header
                    icon="bx-copyright"
                    iconBackground="bg-secondary-subtle text-secondary"
                    title="Copyright"
                    [subtitle]="aboutService.creator()?.copyright || '© ' + currentYear + ' All rights reserved.'"
                    [showValue]="false">
                  </app-hub-tile-header>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Footer Links -->
          <div class="d-flex gap-3 flex-wrap justify-content-center text-muted small mt-4 pt-4 border-top">
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
        </div>
      }
    </div>
    `,
    styles: [`
      .about-hub { 
        padding: 1.5rem; 
        max-width: 1200px; 
        margin: 0 auto; 
      }
      
      .hierarchy-tile {
        cursor: pointer;
        transition: all 0.2s ease;
        border: 1px solid var(--vz-border-color);
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(var(--vz-primary-rgb), 0.15);
          border-color: var(--vz-primary);
        }
        
        &.muted {
          opacity: 0.6;
        }
      }
      
      /* Custom purple color support */
      .bg-purple-subtle { background-color: rgba(135, 114, 249, 0.1) !important; }
      .text-purple { color: #8772f9 !important; }
    `]
})
export class AboutHubComponent implements OnInit {
  aboutService = inject(AboutService);
  private accountService = inject(AccountService);
  
  accountName: string = '';
  currentYear = new Date().getFullYear();

  ngOnInit(): void {
    this.accountService.getConfigValue<string>('account.name')
      .subscribe(name => this.accountName = name || 'Current Organization');
  }

  /** Helper to create type-safe badge array for theme version */
  getThemeBadges(): { text: string; class: string }[] {
    const version = this.aboutService.theme()?.version;
    return version ? [{ text: version, class: 'bg-secondary-subtle text-secondary' }] : [];
  }
}
