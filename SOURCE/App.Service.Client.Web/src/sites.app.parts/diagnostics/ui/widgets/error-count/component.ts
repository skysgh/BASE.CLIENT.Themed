/**
 * Error Count Widget
 * 
 * Dashboard widget showing count of errors.
 */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogService } from '../../../logs/services/log.service';

@Component({
  selector: 'app-error-count-widget',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card h-100 border-danger">
      <div class="card-body">
        <div class="d-flex align-items-center">
          <div class="avatar-sm me-3">
            <div class="avatar-title bg-danger-subtle text-danger rounded">
              <i class="ri-error-warning-line fs-20"></i>
            </div>
          </div>
          <div class="flex-grow-1">
            <h6 class="text-muted mb-1">Errors</h6>
            @if (logService.loading()) {
              <div class="spinner-border spinner-border-sm text-danger"></div>
            } @else {
              <h3 class="mb-0 text-danger">{{ logService.summary().errors }}</h3>
            }
          </div>
        </div>
        <p class="text-muted small mt-2 mb-0">
          {{ logService.summary().errorRate }}% error rate
        </p>
        <a routerLink="/apps/system/diagnostics/logs" [queryParams]="{level: 'error'}" class="stretched-link"></a>
      </div>
    </div>
  `
})
export class ErrorCountWidgetComponent {
  logService = inject(LogService);
}
