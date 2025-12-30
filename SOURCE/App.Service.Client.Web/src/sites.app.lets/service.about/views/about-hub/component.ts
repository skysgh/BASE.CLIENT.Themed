/**
 * About Hub Component
 * 
 * Main hub showing the Creator → Distributor → Account hierarchy
 * with links to detailed views for licenses, version info, etc.
 */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AboutService } from '../../services/about.service';
import { AccountService } from '../../../../core/services/account.service';

@Component({
  selector: 'app-about-hub',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="about-hub">
      <div class="page-header mb-4">
        <h4 class="mb-1">
          <i class="bx bx-info-circle me-2 text-primary"></i>
          About
        </h4>
        <p class="text-muted mb-0">Service information and attributions</p>
      </div>

      <!-- Loading State -->
      <div *ngIf="aboutService.loading()" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
        <p class="text-muted mt-2">Loading...</p>
      </div>

      <!-- Content -->
      <div *ngIf="!aboutService.loading()">
        
        <!-- Distribution Hierarchy -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bx bx-sitemap me-2"></i>
              Service Hierarchy
            </h5>
          </div>
          <div class="card-body">
            <div class="hierarchy-chain">
              
              <!-- Creator -->
              <div class="hierarchy-item" routerLink="creator" style="cursor: pointer;">
                <div class="hierarchy-icon creator">
                  <i class="bx bx-code-alt fs-24"></i>
                </div>
                <div class="hierarchy-content">
                  <div class="hierarchy-label">Creator</div>
                  <div class="hierarchy-value">
                    {{ aboutService.creator()?.name || 'Unknown' }}
                  </div>
                  <div class="hierarchy-desc text-muted small">
                    Original developer/platform owner
                  </div>
                </div>
                <i class="bx bx-chevron-right text-muted"></i>
              </div>

              <div class="hierarchy-arrow">
                <i class="bx bx-chevron-down"></i>
              </div>

              <!-- Distributor -->
              <div class="hierarchy-item" 
                   [class.muted]="!aboutService.hasDistributor()"
                   routerLink="distributor"
                   style="cursor: pointer;">
                <div class="hierarchy-icon distributor">
                  <i class="bx bx-store fs-24"></i>
                </div>
                <div class="hierarchy-content">
                  <div class="hierarchy-label">Distributor</div>
                  <div class="hierarchy-value">
                    {{ aboutService.distributor()?.name || 'Direct' }}
                  </div>
                  <div class="hierarchy-desc text-muted small">
                    {{ aboutService.hasDistributor() ? 'Reseller/partner' : 'No reseller in chain' }}
                  </div>
                </div>
                <i class="bx bx-chevron-right text-muted"></i>
              </div>

              <div class="hierarchy-arrow">
                <i class="bx bx-chevron-down"></i>
              </div>

              <!-- Account -->
              <div class="hierarchy-item" routerLink="account" style="cursor: pointer;">
                <div class="hierarchy-icon account">
                  <i class="bx bx-building fs-24"></i>
                </div>
                <div class="hierarchy-content">
                  <div class="hierarchy-label">Account</div>
                  <div class="hierarchy-value">
                    {{ accountName || 'Current Organization' }}
                  </div>
                  <div class="hierarchy-desc text-muted small">
                    Your organization/tenant
                  </div>
                </div>
                <i class="bx bx-chevron-right text-muted"></i>
              </div>

            </div>
          </div>
        </div>

        <!-- Quick Links Row -->
        <div class="row">
          
          <!-- Version Info Card -->
          <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 link-card" routerLink="version" style="cursor: pointer;">
              <div class="card-body text-center">
                <div class="icon-circle bg-primary-subtle mb-3">
                  <i class="bx bx-chip text-primary fs-32"></i>
                </div>
                <h5>Version Info</h5>
                <p class="text-muted mb-2">{{ aboutService.version()?.version || '1.0.0' }}</p>
                <span class="badge" 
                      [class.bg-success]="aboutService.version()?.environment === 'production'"
                      [class.bg-warning]="aboutService.version()?.environment !== 'production'">
                  {{ aboutService.version()?.environment || 'development' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Licenses Card -->
          <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 link-card" routerLink="licenses" style="cursor: pointer;">
              <div class="card-body text-center">
                <div class="icon-circle bg-info-subtle mb-3">
                  <i class="bx bx-file text-info fs-32"></i>
                </div>
                <h5>Open Source Licenses</h5>
                <p class="text-muted mb-2">Third-party attributions</p>
                <span class="badge bg-info">
                  {{ aboutService.licenseCount() }} packages
                </span>
              </div>
            </div>
          </div>

          <!-- Copyright Card -->
          <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <div class="icon-circle bg-secondary-subtle mb-3">
                  <i class="bx bx-copyright text-secondary fs-32"></i>
                </div>
                <h5>Copyright</h5>
                <p class="text-muted mb-0">
                  {{ aboutService.creator()?.copyright || '© ' + currentYear + ' All rights reserved.' }}
                </p>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer Links -->
        <div class="d-flex gap-3 flex-wrap justify-content-center text-muted small mt-4">
          <a *ngIf="aboutService.creator()?.website" 
             [href]="aboutService.creator()?.website" 
             target="_blank"
             class="text-muted">
            <i class="bx bx-globe me-1"></i>
            Website
          </a>
          <a *ngIf="aboutService.creator()?.social?.github"
             [href]="aboutService.creator()?.social?.github"
             target="_blank"
             class="text-muted">
            <i class="bx bxl-github me-1"></i>
            GitHub
          </a>
          <a routerLink="/apps/compliance/privacy-policy" class="text-muted">
            <i class="bx bx-lock me-1"></i>
            Privacy Policy
          </a>
          <a routerLink="/apps/compliance/terms-conditions" class="text-muted">
            <i class="bx bx-file me-1"></i>
            Terms & Conditions
          </a>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .about-hub { padding: 1.5rem; max-width: 1000px; margin: 0 auto; }
    
    .hierarchy-chain { display: flex; flex-direction: column; align-items: center; }
    
    .hierarchy-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      background: var(--vz-light);
      border-radius: 0.5rem;
      width: 100%;
      max-width: 400px;
      transition: all 0.2s;
    }
    .hierarchy-item:hover {
      background: var(--vz-primary-bg-subtle);
      transform: translateX(4px);
    }
    .hierarchy-item.muted { opacity: 0.6; }
    
    .hierarchy-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .hierarchy-icon.creator { background: linear-gradient(135deg, #667eea, #764ba2); }
    .hierarchy-icon.distributor { background: linear-gradient(135deg, #11998e, #38ef7d); }
    .hierarchy-icon.account { background: linear-gradient(135deg, #ee0979, #ff6a00); }
    
    .hierarchy-content { flex: 1; }
    .hierarchy-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--vz-secondary-color); }
    .hierarchy-value { font-weight: 600; font-size: 1.1rem; }
    
    .hierarchy-arrow {
      color: var(--vz-secondary-color);
      padding: 0.5rem;
    }
    
    .icon-circle {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }
    
    .link-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .link-card { transition: all 0.2s; }
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
}
