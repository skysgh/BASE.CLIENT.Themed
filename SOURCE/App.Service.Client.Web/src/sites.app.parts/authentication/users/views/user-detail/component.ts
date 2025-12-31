import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

/**
 * User Detail Component
 * 
 * View/edit a specific user identity.
 * Placeholder - to be expanded.
 */
@Component({
    selector: 'app-user-detail',
    imports: [CommonModule, RouterModule],
    template: `
    <div class="user-detail-page">
      <div class="page-header mb-4">
        <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3">
          <i class="ri-arrow-left-line"></i>
        </a>
        <h4 class="d-inline-block mb-0">User Details</h4>
      </div>
      
      <div class="card">
        <div class="card-body">
          <p class="text-muted">User detail view coming soon.</p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .user-detail-page { padding: 1.5rem; }
  `]
})
export class UserDetailComponent {
  constructor(private route: ActivatedRoute) {}
}
