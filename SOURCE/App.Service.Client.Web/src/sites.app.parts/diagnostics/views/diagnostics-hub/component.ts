/**
 * Diagnostics Hub Component
 * 
 * Central diagnostics page.
 * Provides navigation to log viewer and dashboard.
 * 
 * Route: /system/diagnostics
 */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogService } from '../../logs/services/log.service';

@Component({
  selector: 'app-diagnostics-hub',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid" style="max-width: 1200px; padding: 1.5rem;">
      <!-- Header -->
      <div class="d-flex align-items-center gap-3 mb-4">
        <div class="avatar-sm">
          <div class="avatar-title bg-info-subtle text-info rounded">
            <i class="ri-pulse-line fs-20"></i>
          </div>
        </div>
        <div>
          <h4 class="mb-1">System Diagnostics</h4>
          <p class="text-muted mb-0">Monitor logs and system health</p>
        </div>
      </div>

      <!-- Quick Stats Row -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card bg-primary-subtle border-0">
            <div class="card-body text-center">
              <h2 class="text-primary mb-1">{{ logService.totalCount() }}</h2>
              <p class="text-muted mb-0">Total Logs</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-danger-subtle border-0">
            <div class="card-body text-center">
              <h2 class="text-danger mb-1">{{ logService.summary().errors }}</h2>
              <p class="text-muted mb-0">Errors</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning-subtle border-0">
            <div class="card-body text-center">
              <h2 class="text-warning mb-1">{{ logService.summary().warnings }}</h2>
              <p class="text-muted mb-0">Warnings</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success-subtle border-0">
            <div class="card-body text-center">
              <h2 class="text-success mb-1">{{ 100 - logService.summary().errorRate }}%</h2>
              <p class="text-muted mb-0">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Cards -->
      <div class="row">
        <!-- Log Viewer -->
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="avatar-sm me-3">
                  <div class="avatar-title bg-primary rounded">
                    <i class="ri-file-list-3-line text-white fs-20"></i>
                  </div>
                </div>
                <div>
                  <h5 class="mb-0">Log Viewer</h5>
                  <small class="text-muted">Browse and search logs</small>
                </div>
              </div>
              <p class="text-muted">
                View diagnostic logs from all system components.
                Filter by level, source, or search for specific messages.
              </p>
              <a routerLink="logs" class="btn btn-soft-primary">
                <i class="ri-search-line me-1"></i> Browse Logs
              </a>
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
                  <h5 class="mb-0">Dashboard</h5>
                  <small class="text-muted">Statistics and widgets</small>
                </div>
              </div>
              <p class="text-muted">
                View log statistics, error rates, and top sources.
                Monitor system health at a glance.
              </p>
              <a routerLink="dashboard" class="btn btn-soft-info">
                <i class="ri-pie-chart-line me-1"></i> View Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Errors -->
      @if (logService.summary().errors > 0) {
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0 text-danger">
              <i class="ri-error-warning-line me-2"></i>
              Recent Errors
            </h5>
            <a routerLink="logs" [queryParams]="{level: 'error'}" class="btn btn-sm btn-soft-danger">
              View All Errors
            </a>
          </div>
          <div class="card-body p-0">
            <table class="table table-hover mb-0">
              <tbody>
                @for (log of recentErrors; track log.id) {
                  <tr>
                    <td style="width: 150px;">
                      <span class="badge bg-{{ log.levelColor }}-subtle text-{{ log.levelColor }}">
                        {{ log.levelLabel }}
                      </span>
                    </td>
                    <td>
                      <strong>{{ log.source }}</strong>
                      <span class="text-muted ms-2">{{ log.message | slice:0:60 }}...</span>
                    </td>
                    <td class="text-end text-muted" style="width: 120px;">
                      {{ log.relativeTime }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- Security Notice -->
      <div class="alert alert-info border-0 d-flex align-items-start mt-4" role="alert">
        <i class="ri-shield-line fs-20 me-2 mt-1"></i>
        <div>
          <strong>Security Notice</strong>
          <p class="mb-0 small">
            Log access is tracked for audit purposes. Logs may contain sensitive information 
            and should only be accessed for troubleshooting purposes.
          </p>
        </div>
      </div>
    </div>
  `
})
export class DiagnosticsHubComponent {
  logService = inject(LogService);
  
  get recentErrors() {
    return this.logService.logs()
      .filter(l => l.level === 'error' || l.level === 'fatal')
      .slice(0, 5);
  }
}
