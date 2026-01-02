/**
 * Embargo Count Widget
 * 
 * Dashboard widget showing count of embargoed countries.
 * Can be used in access dashboard or other dashboards.
 */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmbargoService } from '../../../embargos/services/embargo.service';

@Component({
  selector: 'app-embargo-count-widget',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card h-100 border-danger">
      <div class="card-body">
        <div class="d-flex align-items-center">
          <div class="avatar-sm me-3">
            <div class="avatar-title bg-danger-subtle text-danger rounded">
              <i class="ri-forbid-line fs-20"></i>
            </div>
          </div>
          <div class="flex-grow-1">
            <h6 class="text-muted mb-1">Embargoed</h6>
            @if (embargoService.loading()) {
              <div class="spinner-border spinner-border-sm text-danger"></div>
            } @else {
              <h3 class="mb-0 text-danger">{{ embargoService.activeCount() }}</h3>
            }
          </div>
        </div>
        <p class="text-muted small mt-2 mb-0">
          {{ embargoService.activeCount() }} countries blocked
        </p>
        <a routerLink="/apps/system/access/embargos" class="stretched-link"></a>
      </div>
    </div>
  `
})
export class EmbargoCountWidgetComponent {
  embargoService = inject(EmbargoService);
}
