/**
 * Creator Info Component
 * 
 * Displays information about the service creator/developer.
 */
import { Component, inject } from '@angular/core';

import { RouterModule } from '@angular/router';
import { AboutService } from '../../../services/about.service';

@Component({
    selector: 'app-creator-info',
    imports: [RouterModule],
    template: `
    <div class="creator-page">
      <div class="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3">
            <i class="bx bx-arrow-back"></i>
          </a>
          <h4 class="d-inline-block mb-0">
            <i class="bx bx-code-alt me-2 text-primary"></i>
            Creator Information
          </h4>
        </div>
      </div>
    
      @if (aboutService.creator(); as creator) {
        <div>
          <!-- Creator Card -->
          <div class="card mb-4">
            <div class="card-body">
              <div class="d-flex align-items-center mb-4">
                <div class="creator-logo me-4">
                  @if (creator.logo) {
                    <img
                      [src]="creator.logo"
                      [alt]="creator.name"
                      class="img-fluid"
                      style="max-height: 80px;">
                  }
                  @if (!creator.logo) {
                    <div class="logo-placeholder">
                      <i class="bx bx-code-alt fs-48"></i>
                    </div>
                  }
                </div>
                <div>
                  <h3 class="mb-1">{{ creator.name }}</h3>
                  <p class="text-muted mb-0">Platform Creator & Developer</p>
                </div>
              </div>
              @if (creator.description) {
                <p class="mb-4">
                  {{ creator.description }}
                </p>
              }
              <div class="row">
                <div class="col-md-6">
                  <h6 class="text-muted mb-3">Contact</h6>
                  <ul class="list-unstyled">
                    @if (creator.website) {
                      <li class="mb-2">
                        <a [href]="creator.website" target="_blank" class="text-decoration-none">
                          <i class="bx bx-globe me-2 text-primary"></i>
                          {{ creator.website }}
                        </a>
                      </li>
                    }
                    @if (creator.email) {
                      <li class="mb-2">
                        <a [href]="'mailto:' + creator.email" class="text-decoration-none">
                          <i class="bx bx-envelope me-2 text-primary"></i>
                          {{ creator.email }}
                        </a>
                      </li>
                    }
                  </ul>
                </div>
                <div class="col-md-6">
                  <h6 class="text-muted mb-3">Social</h6>
                  <div class="d-flex gap-3">
                    @if (creator.social?.github) {
                      <a
                        [href]="creator.social!.github"
                        target="_blank"
                        class="social-link">
                        <i class="bx bxl-github fs-24"></i>
                      </a>
                    }
                    @if (creator.social?.twitter) {
                      <a
                        [href]="creator.social!.twitter"
                        target="_blank"
                        class="social-link">
                        <i class="bx bxl-twitter fs-24"></i>
                      </a>
                    }
                    @if (creator.social?.linkedin) {
                      <a
                        [href]="creator.social!.linkedin"
                        target="_blank"
                        class="social-link">
                        <i class="bx bxl-linkedin fs-24"></i>
                      </a>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Copyright -->
          <div class="card">
            <div class="card-body text-center">
              <i class="bx bx-copyright fs-32 text-muted mb-2"></i>
              <p class="mb-0">{{ creator.copyright }}</p>
            </div>
          </div>
        </div>
      }
    
      <!-- Navigation -->
      <div class="d-flex justify-content-between mt-4">
        <a routerLink="../" class="btn btn-outline-secondary">
          <i class="bx bx-arrow-back me-1"></i>
          Back to About
        </a>
        <a routerLink="../distributor" class="btn btn-outline-primary">
          Next: Distributor
          <i class="bx bx-arrow-right ms-1"></i>
        </a>
      </div>
    </div>
    `,
    styles: [`
    .creator-page { padding: 1.5rem; max-width: 800px; margin: 0 auto; }
    
    .logo-placeholder {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .social-link {
      width: 40px;
      height: 40px;
      background: var(--vz-light);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--vz-secondary-color);
      transition: all 0.2s;
    }
    .social-link:hover {
      background: var(--vz-primary);
      color: white;
    }
  `]
})
export class CreatorInfoComponent {
  aboutService = inject(AboutService);
}
