/**
 * Distributor Info Component
 * 
 * Displays information about the service distributor/reseller.
 * This may be empty if the creator sells directly.
 */
import { Component, inject } from '@angular/core';

import { RouterModule } from '@angular/router';
import { AboutService } from '../../../services/about.service';

@Component({
    selector: 'app-distributor-info',
    imports: [RouterModule],
    template: `
    <div class="distributor-page">
      <div class="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3">
            <i class="bx bx-arrow-back"></i>
          </a>
          <h4 class="d-inline-block mb-0">
            <i class="bx bx-store me-2 text-success"></i>
            Distributor Information
          </h4>
        </div>
      </div>
    
      <!-- Has Distributor -->
      @if (aboutService.hasDistributor() && aboutService.distributor()?.name !== 'Direct') {
        <div>
          @if (aboutService.distributor(); as distributor) {
            <div class="card mb-4">
              <div class="card-body">
                <div class="d-flex align-items-center mb-4">
                  <div class="distributor-logo me-4">
                    @if (distributor.logo) {
                      <img
                        [src]="distributor.logo"
                        [alt]="distributor.name"
                        class="img-fluid"
                        style="max-height: 80px;">
                    }
                    @if (!distributor.logo) {
                      <div class="logo-placeholder">
                        <i class="bx bx-store fs-48"></i>
                      </div>
                    }
                  </div>
                  <div>
                    <h3 class="mb-1">{{ distributor.name }}</h3>
                    <p class="text-muted mb-0">
                      Authorized Distributor
                      @if (distributor.partnerTier) {
                        <span class="badge bg-success ms-2">
                          {{ distributor.partnerTier }}
                        </span>
                      }
                    </p>
                  </div>
                </div>
                @if (distributor.description) {
                  <p class="mb-4">
                    {{ distributor.description }}
                  </p>
                }
                <div class="row">
                  <div class="col-md-6">
                    <h6 class="text-muted mb-3">Contact</h6>
                    <ul class="list-unstyled">
                      @if (distributor.website) {
                        <li class="mb-2">
                          <a [href]="distributor.website" target="_blank" class="text-decoration-none">
                            <i class="bx bx-globe me-2 text-success"></i>
                            {{ distributor.website }}
                          </a>
                        </li>
                      }
                      @if (distributor.email) {
                        <li class="mb-2">
                          <a [href]="'mailto:' + distributor.email" class="text-decoration-none">
                            <i class="bx bx-envelope me-2 text-success"></i>
                            {{ distributor.email }}
                          </a>
                        </li>
                      }
                      @if (distributor.supportUrl) {
                        <li class="mb-2">
                          <a [href]="distributor.supportUrl" target="_blank" class="text-decoration-none">
                            <i class="bx bx-support me-2 text-success"></i>
                            Support Portal
                          </a>
                        </li>
                      }
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }
    
      <!-- No Distributor (Direct) -->
      @if (!aboutService.hasDistributor() || aboutService.distributor()?.name === 'Direct') {
        <div>
          <div class="card">
            <div class="card-body text-center py-5">
              <div class="icon-circle bg-secondary-subtle mx-auto mb-4">
                <i class="bx bx-check-circle fs-48 text-success"></i>
              </div>
              <h4>Direct Distribution</h4>
              <p class="text-muted mb-0">
                This service is provided directly by the creator.<br>
                There is no reseller or partner in the distribution chain.
              </p>
            </div>
          </div>
        </div>
      }
    
      <!-- Distribution Chain Diagram -->
      <div class="card mt-4">
        <div class="card-header">
          <h6 class="mb-0">
            <i class="bx bx-sitemap me-2"></i>
            Distribution Chain
          </h6>
        </div>
        <div class="card-body">
          <div class="chain-diagram">
            <div class="chain-step">
              <div class="chain-icon creator">
                <i class="bx bx-code-alt"></i>
              </div>
              <div class="chain-label">Creator</div>
            </div>
            <div class="chain-arrow">→</div>
            <div class="chain-step" [class.muted]="!aboutService.hasDistributor() || aboutService.distributor()?.name === 'Direct'">
              <div class="chain-icon distributor">
                <i class="bx bx-store"></i>
              </div>
              <div class="chain-label">Distributor</div>
            </div>
            <div class="chain-arrow">→</div>
            <div class="chain-step">
              <div class="chain-icon account">
                <i class="bx bx-building"></i>
              </div>
              <div class="chain-label">Your Account</div>
            </div>
          </div>
        </div>
      </div>
    
      <!-- Navigation -->
      <div class="d-flex justify-content-between mt-4">
        <a routerLink="../creator" class="btn btn-outline-secondary">
          <i class="bx bx-arrow-back me-1"></i>
          Previous: Creator
        </a>
        <a routerLink="../account" class="btn btn-outline-primary">
          Next: Account
          <i class="bx bx-arrow-right ms-1"></i>
        </a>
      </div>
    </div>
    `,
    styles: [`
    .distributor-page { padding: 1.5rem; max-width: 800px; margin: 0 auto; }
    
    .logo-placeholder {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #11998e, #38ef7d);
      color: white;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .icon-circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .chain-diagram {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }
    
    .chain-step { text-align: center; }
    .chain-step.muted { opacity: 0.3; }
    
    .chain-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
      margin: 0 auto 0.5rem;
    }
    .chain-icon.creator { background: linear-gradient(135deg, #667eea, #764ba2); }
    .chain-icon.distributor { background: linear-gradient(135deg, #11998e, #38ef7d); }
    .chain-icon.account { background: linear-gradient(135deg, #ee0979, #ff6a00); }
    
    .chain-arrow {
      font-size: 1.5rem;
      color: var(--vz-secondary-color);
    }
    
    .chain-label {
      font-size: 0.875rem;
      color: var(--vz-secondary-color);
    }
  `]
})
export class DistributorInfoComponent {
  aboutService = inject(AboutService);
}
