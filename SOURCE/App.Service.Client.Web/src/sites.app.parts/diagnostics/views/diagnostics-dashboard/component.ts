/**
 * Diagnostics Dashboard Component
 * 
 * Dashboard with widgets for log statistics.
 * 
 * Route: /system/diagnostics/dashboard
 */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogService } from '../../logs/services/log.service';
import { LOG_LEVELS, LogLevel } from '../../logs/models/log-entry.dto';
import { ErrorCountWidgetComponent } from '../../widgets/error-count/component';
import { LogVolumeWidgetComponent } from '../../widgets/log-volume/component';

@Component({
  selector: 'app-diagnostics-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    ErrorCountWidgetComponent,
    LogVolumeWidgetComponent
  ],
  template: `
    <div class="container-fluid" style="max-width: 1200px; padding: 1.5rem;">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a routerLink="/apps/system/diagnostics">Diagnostics</a></li>
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
            <h4 class="mb-0">Diagnostics Dashboard</h4>
            <p class="text-muted mb-0">System health overview</p>
          </div>
        </div>
        <button class="btn btn-soft-primary" (click)="refresh()">
          <i class="ri-refresh-line me-1"></i> Refresh
        </button>
      </div>

      <!-- Widgets Row -->
      <div class="row mb-4">
        <div class="col-md-4">
          <app-error-count-widget></app-error-count-widget>
        </div>
        <div class="col-md-4">
          <app-log-volume-widget></app-log-volume-widget>
        </div>
        <div class="col-md-4">
          <!-- Health Status Widget -->
          <div class="card h-100" [class.border-success]="healthStatus === 'healthy'" [class.border-warning]="healthStatus === 'degraded'" [class.border-danger]="healthStatus === 'critical'">
            <div class="card-body text-center">
              @if (healthStatus === 'healthy') {
                <i class="ri-checkbox-circle-line fs-48 text-success"></i>
                <h5 class="mt-2 text-success">HEALTHY</h5>
              } @else if (healthStatus === 'degraded') {
                <i class="ri-alert-line fs-48 text-warning"></i>
                <h5 class="mt-2 text-warning">DEGRADED</h5>
              } @else {
                <i class="ri-error-warning-line fs-48 text-danger"></i>
                <h5 class="mt-2 text-danger">CRITICAL</h5>
              }
              <p class="text-muted mb-0">System Status</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Level Breakdown -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Log Level Distribution</h5>
            </div>
            <div class="card-body">
              @for (item of logService.summary().levelBreakdown; track item.level) {
                <div class="d-flex align-items-center mb-3">
                  <div style="width: 80px;">
                    <span class="badge bg-{{ getLevelMeta(item.level).color }}-subtle text-{{ getLevelMeta(item.level).color }}">
                      {{ getLevelMeta(item.level).label }}
                    </span>
                  </div>
                  <div class="flex-grow-1 mx-3">
                    <div class="progress" style="height: 8px;">
                      <div 
                        class="progress-bar bg-{{ getLevelMeta(item.level).color }}" 
                        [style.width.%]="item.percentage">
                      </div>
                    </div>
                  </div>
                  <div style="width: 60px;" class="text-end">
                    <span class="text-muted">{{ item.count }}</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Top Sources</h5>
            </div>
            <div class="card-body">
              @for (source of logService.summary().topSources; track source.source) {
                <div class="d-flex align-items-center mb-3">
                  <div class="flex-grow-1">
                    <strong>{{ source.source }}</strong>
                  </div>
                  <div class="mx-3" style="width: 150px;">
                    <div class="progress" style="height: 8px;">
                      <div 
                        class="progress-bar bg-primary" 
                        [style.width.%]="source.percentage">
                      </div>
                    </div>
                  </div>
                  <div style="width: 50px;" class="text-end">
                    <span class="badge bg-secondary">{{ source.count }}</span>
                  </div>
                </div>
              }
              @if (logService.summary().topSources.length === 0) {
                <p class="text-muted text-center mb-0">No data available</p>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Quick Actions</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <a routerLink="../logs" class="btn btn-soft-primary w-100">
                <i class="ri-file-list-3-line me-2"></i>View All Logs
              </a>
            </div>
            <div class="col-md-3">
              <a routerLink="../logs" [queryParams]="{level: 'error'}" class="btn btn-soft-danger w-100">
                <i class="ri-error-warning-line me-2"></i>View Errors
              </a>
            </div>
            <div class="col-md-3">
              <a routerLink="../logs" [queryParams]="{level: 'warn'}" class="btn btn-soft-warning w-100">
                <i class="ri-alert-line me-2"></i>View Warnings
              </a>
            </div>
            <div class="col-md-3">
              <button class="btn btn-soft-secondary w-100" disabled>
                <i class="ri-download-line me-2"></i>Export (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DiagnosticsDashboardComponent {
  logService = inject(LogService);
  
  get healthStatus(): 'healthy' | 'degraded' | 'critical' {
    const errorRate = this.logService.summary().errorRate;
    if (errorRate > 20) return 'critical';
    if (errorRate > 5) return 'degraded';
    return 'healthy';
  }
  
  getLevelMeta(level: LogLevel) {
    return LOG_LEVELS[level];
  }
  
  refresh(): void {
    this.logService.refresh();
  }
}
