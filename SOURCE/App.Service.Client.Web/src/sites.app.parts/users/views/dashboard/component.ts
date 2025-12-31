import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Users Dashboard Component
 * 
 * Entry point for user management - overview with quick stats and actions.
 */
@Component({
  selector: 'app-users-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="users-dashboard">
      <div class="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2><i class="bx bx-user-circle me-2 text-primary"></i>User Management</h2>
          <p class="text-muted mb-0">Manage system users and their access</p>
        </div>
        <div>
          <a routerLink="add" class="btn btn-primary">
            <i class="bx bx-plus me-1"></i>Add User
          </a>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="row mb-4">
        <div class="col-md-3" *ngFor="let stat of stats">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="avatar-sm me-3" [style.background-color]="stat.color">
                  <i class="bx {{stat.icon}} avatar-title text-white rounded"></i>
                </div>
                <div>
                  <h4 class="mb-0">{{stat.value}}</h4>
                  <p class="text-muted mb-0 small">{{stat.label}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="row">
        <div class="col-md-3 mb-3" *ngFor="let action of actions">
          <div class="card action-card h-100" [routerLink]="action.route">
            <div class="card-body text-center py-4">
              <i class="bx {{action.icon}} fs-1 text-primary mb-2"></i>
              <h6 class="mb-1">{{action.title}}</h6>
              <p class="text-muted small mb-0">{{action.description}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .users-dashboard { padding: 1.5rem; }
    .action-card { cursor: pointer; transition: all 0.2s; }
    .action-card:hover { border-color: var(--vz-primary); transform: translateY(-2px); }
    .avatar-sm { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 0.5rem; }
  `]
})
export class UsersDashboardComponent {
  stats = [
    { label: 'Total Users', value: '1,234', icon: 'bx-group', color: '#3577f1' },
    { label: 'Active', value: '1,180', icon: 'bx-check-circle', color: '#0ab39c' },
    { label: 'Pending', value: '42', icon: 'bx-time', color: '#f7b84b' },
    { label: 'Suspended', value: '12', icon: 'bx-block', color: '#f06548' },
  ];

  actions = [
    { title: 'Browse Users', description: 'View all users', icon: 'bx-list-ul', route: 'browse' },
    { title: 'Add User', description: 'Create new user', icon: 'bx-user-plus', route: 'add' },
    { title: 'Import Users', description: 'Bulk import', icon: 'bx-import', route: 'import' },
    { title: 'Insights', description: 'User analytics', icon: 'bx-bar-chart-alt-2', route: 'insights' },
    { title: 'Search', description: 'Advanced search', icon: 'bx-search-alt', route: 'search' },
    { title: 'Settings', description: 'User settings', icon: 'bx-cog', route: 'settings' },
  ];
}
