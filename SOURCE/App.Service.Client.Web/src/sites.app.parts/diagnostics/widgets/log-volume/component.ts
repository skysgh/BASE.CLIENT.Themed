/**
 * Log Volume Widget
 * 
 * Dashboard widget showing total log volume.
 */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogService } from '../../logs/services/log.service';

@Component({
  selector: 'app-log-volume-widget',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card h-100 border-primary">
      <div class="card-body">
        <div class="d-flex align-items-center">
          <div class="avatar-sm me-3">
            <div class="avatar-title bg-primary-subtle text-primary rounded">
              <i class="ri-file-list-3-line fs-20"></i>
            </div>
          </div>
          <div class="flex-grow-1">
            <h6 class="text-muted mb-1">Log Volume</h6>
            @if (logService.loading()) {
              <div class="spinner-border spinner-border-sm text-primary"></div>
            } @else {
              <h3 class="mb-0 text-primary">{{ logService.totalCount() }}</h3>
            }
          </div>
        </div>
        <p class="text-muted small mt-2 mb-0">
          Total entries
        </p>
        <a routerLink="/apps/system/diagnostics/logs" class="stretched-link"></a>
      </div>
    </div>
  `
})
export class LogVolumeWidgetComponent {
  logService = inject(LogService);
}
