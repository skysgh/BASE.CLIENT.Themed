/**
 * Available Countries Widget
 * 
 * Dashboard widget showing count of available (non-embargoed) countries.
 * Displays a positive message: "Available in X countries!"
 */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmbargoService } from '../../embargos/services/embargo.service';

@Component({
  selector: 'app-available-countries-widget',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card h-100 border-success">
      <div class="card-body">
        <div class="d-flex align-items-center">
          <div class="avatar-sm me-3">
            <div class="avatar-title bg-success-subtle text-success rounded">
              <i class="ri-global-line fs-20"></i>
            </div>
          </div>
          <div class="flex-grow-1">
            <h6 class="text-muted mb-1">Available</h6>
            @if (embargoService.loading()) {
              <div class="spinner-border spinner-border-sm text-success"></div>
            } @else {
              <h3 class="mb-0 text-success">{{ embargoService.availableCount() }}</h3>
            }
          </div>
        </div>
        <p class="text-muted small mt-2 mb-0">
          Available in {{ embargoService.availableCount() }} countries!
        </p>
        <a routerLink="/apps/system/access/dashboard" class="stretched-link"></a>
      </div>
    </div>
  `
})
export class AvailableCountriesWidgetComponent {
  embargoService = inject(EmbargoService);
}
