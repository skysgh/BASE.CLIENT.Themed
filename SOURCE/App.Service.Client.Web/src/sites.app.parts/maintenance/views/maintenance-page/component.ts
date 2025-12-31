/**
 * Maintenance Page Component
 * 
 * Displays service maintenance/downtime information.
 * Can show live status updates from API (future).
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface StatusUpdate {
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'success';
}

@Component({
  selector: 'app-maintenance-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="auth-page-wrapper pt-5">
      <!-- Background -->
      <div class="auth-one-bg-position auth-one-bg" id="auth-particles">
        <div class="bg-overlay"></div>
        <div class="shape">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1440 120">
            <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
          </svg>
        </div>
      </div>

      <!-- Content -->
      <div class="auth-page-content">
        <div class="container">
          <div class="row">
            <div class="col-lg-12">
              <div class="text-center mt-sm-5 pt-4">
                
                <!-- Icon -->
                <div class="mb-5 text-white-50">
                  <div class="avatar-xl mx-auto mb-4">
                    <div class="avatar-title bg-warning-subtle rounded-circle">
                      <i class="ri-tools-line display-4 text-warning"></i>
                    </div>
                  </div>
                  
                  <h1 class="display-5 coming-soon-text">{{ title }}</h1>
                  <p class="fs-14 mt-3">{{ message }}</p>
                  
                  <!-- ETA -->
                  @if (eta) {
                    <div class="mt-4">
                      <span class="badge bg-light text-dark fs-14 px-3 py-2">
                        <i class="ri-time-line me-1"></i>
                        Estimated return: {{ etaFormatted }}
                      </span>
                    </div>
                  }
                  
                  <!-- Back to home button -->
                  <div class="mt-4 pt-2">
                    <a routerLink="/" class="btn btn-success">
                      <i class="mdi mdi-home me-1"></i> Back to Home
                    </a>
                  </div>
                </div>
                
                <!-- Maintenance illustration -->
                <div class="row justify-content-center mb-5">
                  <div class="col-xl-4 col-lg-6">
                    <div class="text-center">
                      <i class="ri-settings-5-line text-white-50" style="font-size: 150px; opacity: 0.3;"></i>
                    </div>
                  </div>
                </div>
                
                <!-- Status updates -->
                @if (updates.length > 0) {
                  <div class="row justify-content-center">
                    <div class="col-lg-6">
                      <div class="card bg-dark border-0">
                        <div class="card-header border-light">
                          <h5 class="text-white mb-0">
                            <i class="ri-time-line me-2"></i>Status Updates
                          </h5>
                        </div>
                        <div class="card-body">
                          <ul class="list-group list-group-flush">
                            @for (update of updates; track update.timestamp) {
                              <li class="list-group-item bg-transparent border-light text-white-50">
                                <div class="d-flex">
                                  <div class="flex-shrink-0">
                                    <i class="ri-checkbox-circle-line me-2"
                                       [ngClass]="{
                                         'text-info': update.type === 'info',
                                         'text-warning': update.type === 'warning',
                                         'text-success': update.type === 'success'
                                       }"></i>
                                  </div>
                                  <div class="flex-grow-1">
                                    <span class="text-muted small">{{ update.timestamp }}</span>
                                    <p class="mb-0 text-white">{{ update.message }}</p>
                                  </div>
                                </div>
                              </li>
                            }
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <div class="row">
            <div class="col-lg-12">
              <div class="text-center">
                <p class="mb-0 text-muted">
                  &copy; {{ year }} {{ companyName }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .auth-page-wrapper {
      min-height: 100vh;
    }
  `]
})
export class MaintenancePageComponent implements OnInit {
  // Configuration
  title = 'Site is Under Maintenance';
  message = 'We\'re performing scheduled maintenance. Please check back soon.';
  companyName = 'Your Company';
  year = new Date().getFullYear();
  
  // ETA
  eta: Date | null = null;
  
  // Status updates (would come from API in production)
  updates: StatusUpdate[] = [];
  
  get etaFormatted(): string {
    if (!this.eta) return '';
    return this.eta.toLocaleString();
  }
  
  ngOnInit(): void {
    // TODO: Load status from API
    // For now, show demo data
    this.updates = [
      { timestamp: '10:30 AM', message: 'Maintenance started', type: 'info' },
      { timestamp: '10:35 AM', message: 'Database backup in progress', type: 'info' },
      { timestamp: '10:45 AM', message: 'Applying updates...', type: 'warning' }
    ];
    
    // Demo ETA (1 hour from now)
    this.eta = new Date(Date.now() + 60 * 60 * 1000);
  }
}
