import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

/**
 * User-Role Assignment Component
 * 
 * Assigns roles to users.
 */
@Component({
  selector: 'app-user-roles',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="user-roles">
      <div class="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3"><i class="bx bx-arrow-back"></i></a>
          <h4 class="d-inline-block mb-0"><i class="bx bx-user-check me-2 text-primary"></i>User Role Assignments</h4>
        </div>
      </div>

      <!-- Search -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Search User</label>
              <input type="text" class="form-control" placeholder="Name or email..." [(ngModel)]="searchTerm">
            </div>
            <div class="col-md-4">
              <label class="form-label">Filter by Role</label>
              <select class="form-select" [(ngModel)]="selectedRoleFilter">
                <option value="">All Roles</option>
                <option *ngFor="let role of roles" [value]="role.id">{{role.name}}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- User List with Role Assignments -->
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr><th>User</th><th>Email</th><th>Assigned Roles</th><th>Actions</th></tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of users">
                  <td><strong>{{user.name}}</strong></td>
                  <td class="text-muted">{{user.email}}</td>
                  <td>
                    <span *ngFor="let role of user.roles" class="badge bg-primary me-1">{{role}}</span>
                    <span *ngIf="user.roles.length === 0" class="text-muted small">No roles assigned</span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary" (click)="editUserRoles(user)">
                      <i class="bx bx-edit"></i> Manage
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Edit Modal (simplified) -->
      <div *ngIf="editingUser" class="modal d-block" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Manage Roles: {{editingUser.name}}</h5>
              <button type="button" class="btn-close" (click)="editingUser = null"></button>
            </div>
            <div class="modal-body">
              <div *ngFor="let role of roles" class="form-check mb-2">
                <input class="form-check-input" type="checkbox" [id]="'role-' + role.id"
                       [checked]="editingUser.roles.includes(role.name)"
                       (change)="toggleRole(role.name, $event)">
                <label class="form-check-label" [for]="'role-' + role.id">
                  <strong>{{role.name}}</strong>
                  <span class="text-muted d-block small">{{role.description}}</span>
                </label>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline-secondary" (click)="editingUser = null">Cancel</button>
              <button class="btn btn-primary" (click)="saveUserRoles()">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`.user-roles { padding: 1.5rem; }`]
})
export class UserRolesComponent {
  searchTerm = '';
  selectedRoleFilter = '';
  editingUser: any = null;

  roles = [
    { id: '1', name: 'Admin', description: 'Full administrative access' },
    { id: '2', name: 'Moderator', description: 'Content moderation' },
    { id: '3', name: 'Editor', description: 'Content editing' },
    { id: '4', name: 'Viewer', description: 'Read-only access' },
  ];

  users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', roles: ['Admin', 'Editor'] },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', roles: ['Moderator'] },
    { id: '3', name: 'Bob Wilson', email: 'bob@example.com', roles: [] },
    { id: '4', name: 'Alice Brown', email: 'alice@example.com', roles: ['Viewer'] },
  ];

  editUserRoles(user: any) {
    this.editingUser = { ...user, roles: [...user.roles] };
  }

  toggleRole(roleName: string, event: any) {
    if (event.target.checked) {
      this.editingUser.roles.push(roleName);
    } else {
      this.editingUser.roles = this.editingUser.roles.filter((r: string) => r !== roleName);
    }
  }

  saveUserRoles() {
    const userIndex = this.users.findIndex(u => u.id === this.editingUser.id);
    if (userIndex >= 0) {
      this.users[userIndex].roles = [...this.editingUser.roles];
    }
    this.editingUser = null;
  }
}
