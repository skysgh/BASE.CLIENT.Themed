import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Users List Component
 * 
 * Admin view for managing user identities.
 * Placeholder - to be expanded with full CRUD functionality.
 */
@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="users-list-page">
      <div class="page-header mb-4">
        <h2>
          <i class="ri-user-line me-2 text-primary"></i>
          User Management
        </h2>
        <p class="text-muted">Manage user identities in the system.</p>
      </div>
      
      <div class="alert alert-info">
        <i class="ri-information-line me-2"></i>
        User management interface coming soon. 
        This will allow administrators to view and manage user accounts.
      </div>
      
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Users</h5>
          <p class="text-muted">
            Users are thin identity entities that reference Person records.
            Key fields: enabled, validFrom, validTo.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .users-list-page { padding: 1.5rem; }
  `]
})
export class UsersListComponent { }
