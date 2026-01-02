/**
 * Access Dashboard Component
 * 
 * Dashboard with widgets for access/embargo statistics.
 * 
 * Route: /system/access/dashboard
 */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmbargoService } from '../../../embargos/services/embargo.service';
import { EmbargoCountWidgetComponent } from '../../widgets/embargo-count/component';
import { AvailableCountriesWidgetComponent } from '../../widgets/available-countries/component';

@Component({
  selector: 'app-access-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    EmbargoCountWidgetComponent,
    AvailableCountriesWidgetComponent
  ],
  template: `
    <div class="container-fluid" style="max-width: 1200px; padding: 1.5rem;">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a routerLink="/apps/system/access">Access</a></li>
          <li class="breadcrumb-item active">Dashboard</li>
        </ol>
      </nav>

      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center gap-3">
          <div class="avatar-sm">
            <div class="avatar-title bg-info-subtle text-info rounded">
              <i class="ri-dashboard-line fs-20"></i>
            </div>
          </div>
          <div>
            <h4 class="mb-0">Access Dashboard</h4>
            <p class="text-muted mb-0">Geographical access overview</p>
          </div>
        </div>
        <button class="btn btn-soft-primary" (click)="refresh()">
          <i class="ri-refresh-line me-1"></i> Refresh
        </button>
      </div>

      <!-- Widgets Row 1 -->
      <div class="row mb-4">
        <div class="col-md-4">
          <app-embargo-count-widget></app-embargo-count-widget>
        </div>
        <div class="col-md-4">
          <app-available-countries-widget></app-available-countries-widget>
        </div>
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="avatar-sm me-3">
                  <div class="avatar-title bg-primary-subtle text-primary rounded">
                    <i class="ri-pie-chart-line fs-20"></i>
                  </div>
                </div>
                <div>
                  <h6 class="text-muted mb-1">Coverage</h6>
                  <h3 class="mb-0">{{ embargoService.stats().coveragePercent }}%</h3>
                </div>
              </div>
              <div class="progress mt-3" style="height: 6px;">
                <div class="progress-bar bg-primary" 
                     [style.width.%]="embargoService.stats().coveragePercent">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Embargoes List -->
      <div class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="mb-0">
            <i class="ri-forbid-line me-2 text-danger"></i>
            Active Embargoes
          </h5>
          <a routerLink="../embargos" class="btn btn-sm btn-soft-primary">
            View All <i class="ri-arrow-right-line ms-1"></i>
          </a>
        </div>
        <div class="card-body p-0">
          @if (embargoService.loading()) {
            <div class="text-center py-4">
              <div class="spinner-border text-primary"></div>
            </div>
          } @else if (embargoService.activeEmbargos().length === 0) {
            <div class="text-center py-4 text-muted">
              <i class="ri-checkbox-circle-line fs-32 text-success"></i>
              <p class="mb-0 mt-2">No active embargoes</p>
            </div>
          } @else {
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Country</th>
                  <th>Reason</th>
                  <th>Effective From</th>
                  <th>Duration</th>
                  <th class="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (embargo of embargoService.activeEmbargos(); track embargo.id) {
                  <tr>
                    <td>
                      <span class="me-2">{{ embargo.flagEmoji }}</span>
                      {{ embargo.displayName }}
                    </td>
                    <td>{{ embargo.reason | slice:0:40 }}...</td>
                    <td>{{ embargo.effectiveFrom | date:'mediumDate' }}</td>
                    <td>
                      <span class="badge bg-{{ embargo.statusColor }}-subtle text-{{ embargo.statusColor }}">
                        {{ embargo.durationDisplay }}
                      </span>
                    </td>
                    <td class="text-end">
                      <a [routerLink]="['../embargos', embargo.id]" class="btn btn-sm btn-soft-primary">
                        <i class="ri-eye-line"></i>
                      </a>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      </div>

      <!-- Stats Summary -->
      <div class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Embargo Status Breakdown</h5>
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between mb-2">
                <span>Active</span>
                <span class="badge bg-danger">{{ embargoService.stats().active }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Inactive</span>
                <span class="badge bg-secondary">{{ embargoService.stats().inactive }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Scheduled</span>
                <span class="badge bg-warning">{{ embargoService.stats().scheduled }}</span>
              </div>
              <hr>
              <div class="d-flex justify-content-between">
                <strong>Total Defined</strong>
                <strong>{{ embargoService.stats().total }}</strong>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Global Availability</h5>
            </div>
            <div class="card-body text-center">
              <div class="mb-3">
                <i class="ri-earth-line text-primary" style="font-size: 64px;"></i>
              </div>
              <h2 class="text-success">{{ embargoService.stats().availableCountries }}</h2>
              <p class="text-muted">of {{ embargoService.stats().totalCountries }} countries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AccessDashboardComponent {
  embargoService = inject(EmbargoService);
  
  refresh(): void {
    this.embargoService.refresh();
  }
}
