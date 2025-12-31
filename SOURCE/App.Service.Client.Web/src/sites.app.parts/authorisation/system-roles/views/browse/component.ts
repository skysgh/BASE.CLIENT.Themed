import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-system-roles-browse',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="roles-browse">
      <div class="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3"><i class="bx bx-arrow-back"></i></a>
          <h4 class="d-inline-block mb-0"><i class="bx bx-briefcase-alt me-2 text-primary"></i>System Roles</h4>
        </div>
        <a routerLink="add" class="btn btn-primary btn-sm"><i class="bx bx-plus me-1"></i>Add Role</a>
      </div>

      <div class="row">
        <div class="col-md-4 mb-4" *ngFor="let role of roles">
          <div class="card h-100 role-card" [routerLink]="[role.id]">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="mb-0">{{role.name}}</h5>
                <span class="badge" [class]="role.isSystem ? 'bg-secondary' : 'bg-primary'">
                  {{role.isSystem ? 'System' : 'Custom'}}
                </span>
              </div>
              <p class="text-muted small mb-3">{{role.description}}</p>
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">{{role.permissionCount}} permissions</small>
                <small class="text-muted">{{role.userCount}} users</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .roles-browse { padding: 1.5rem; }
    .role-card { cursor: pointer; transition: all 0.2s; }
    .role-card:hover { border-color: var(--vz-primary); transform: translateY(-2px); }
  `]
})
export class SystemRolesBrowseComponent {
  roles = [
    { id: '1', name: 'Super Admin', description: 'Full system access with all permissions', permissionCount: 42, userCount: 2, isSystem: true },
    { id: '2', name: 'Admin', description: 'Administrative access without system settings', permissionCount: 35, userCount: 5, isSystem: true },
    { id: '3', name: 'Moderator', description: 'Content moderation and user management', permissionCount: 18, userCount: 12, isSystem: false },
    { id: '4', name: 'Editor', description: 'Content creation and editing', permissionCount: 10, userCount: 25, isSystem: false },
    { id: '5', name: 'Viewer', description: 'Read-only access', permissionCount: 5, userCount: 150, isSystem: true },
  ];
}
