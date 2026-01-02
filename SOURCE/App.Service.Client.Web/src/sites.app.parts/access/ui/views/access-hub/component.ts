/**
 * Access Hub Component
 * 
 * Central access management page.
 * Provides navigation to embargo management and dashboard.
 * 
 * Route: /system/access
 */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmbargoService } from '../../../embargos/services/embargo.service';

@Component({
  selector: 'app-access-hub',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid" style="max-width: 1200px; padding: 1.5rem;">
      <!-- Header -->
      <div class="d-flex align-items-center gap-3 mb-4">
        <div class="avatar-sm">
          <div class="avatar-title bg-warning-subtle text-warning rounded">
            <i class="ri-global-line fs-20"></i>
          </div>
        </div>
        <div>
          <h4 class="mb-1">Access Control</h4>
          <p class="text-muted mb-0">Manage geographical restrictions and embargoes</p>
        </div>
      </div>

      <!-- Quick Stats Row -->
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="card bg-danger-subtle border-0">
            <div class="card-body text-center">
              <h2 class="text-danger mb-1">{{ embargoService.activeCount() }}</h2>
              <p class="text-muted mb-0">Countries Embargoed</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card bg-success-subtle border-0">
            <div class="card-body text-center">
              <h2 class="text-success mb-1">{{ embargoService.availableCount() }}</h2>
              <p class="text-muted mb-0">Countries Available</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card bg-primary-subtle border-0">
            <div class="card-body text-center">
              <h2 class="text-primary mb-1">{{ embargoService.stats().coveragePercent }}%</h2>
              <p class="text-muted mb-0">Global Coverage</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Cards -->
      <div class="row">
        <!-- Embargos -->
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="avatar-sm me-3">
                  <div class="avatar-title bg-danger rounded">
                    <i class="ri-forbid-line text-white fs-20"></i>
                  </div>
                </div>
                <div>
                  <h5 class="mb-0">Embargo List</h5>
                  <small class="text-muted">Manage embargoed countries</small>
                </div>
              </div>
              <p class="text-muted">
                View and manage the list of countries where service is restricted 
                due to sanctions, legal, or compliance requirements.
              </p>
              <div class="d-flex gap-2">
                <a routerLink="embargos" class="btn btn-soft-primary">
                  <i class="ri-list-check me-1"></i> Browse
                </a>
                <a routerLink="embargos/add" class="btn btn-soft-success">
                  <i class="ri-add-line me-1"></i> Add
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Dashboard -->
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="avatar-sm me-3">
                  <div class="avatar-title bg-info rounded">
                    <i class="ri-dashboard-line text-white fs-20"></i>
                  </div>
                </div>
                <div>
                  <h5 class="mb-0">Access Dashboard</h5>
                  <small class="text-muted">Statistics and widgets</small>
                </div>
              </div>
              <p class="text-muted">
                View access statistics, coverage maps, and monitoring widgets
                for geographical access control.
              </p>
              <a routerLink="dashboard" class="btn btn-soft-info">
                <i class="ri-pie-chart-line me-1"></i> View Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Compliance Notice -->
      <div class="alert alert-warning border-0 d-flex align-items-start" role="alert">
        <i class="ri-error-warning-line fs-20 me-2 mt-1"></i>
        <div>
          <strong>Compliance Notice</strong>
          <p class="mb-0 small">
            Embargo lists should be reviewed regularly to ensure compliance with current 
            sanctions laws and regulations. Consult legal counsel for specific requirements.
          </p>
        </div>
      </div>
    </div>
  `
})
export class AccessHubComponent {
  embargoService = inject(EmbargoService);
}
