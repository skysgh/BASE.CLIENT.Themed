import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

/**
 * Role-Permission Association Component
 * 
 * Manages the +/- (grant/deny) association of permissions to roles.
 */
@Component({
  selector: 'app-role-permissions',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="role-permissions">
      <div class="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3"><i class="bx bx-arrow-back"></i></a>
          <h4 class="d-inline-block mb-0"><i class="bx bx-link me-2 text-info"></i>Role-Permission Matrix</h4>
        </div>
      </div>

      <!-- Role Selector -->
      <div class="card mb-4">
        <div class="card-body">
          <label class="form-label">Select Role</label>
          <select class="form-select" style="max-width: 300px;" [(ngModel)]="selectedRole">
            <option *ngFor="let role of roles" [value]="role.id">{{role.name}}</option>
          </select>
        </div>
      </div>

      <!-- Permission Matrix -->
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-bordered mb-0">
              <thead>
                <tr>
                  <th>Permission</th>
                  <th class="text-center" style="width: 100px;">Grant (+)</th>
                  <th class="text-center" style="width: 100px;">Deny (-)</th>
                  <th class="text-center" style="width: 100px;">Inherit</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let cat of permissionMatrix">
                  <td colspan="4" class="bg-light fw-semibold">{{cat.category}}</td>
                </tr>
                <ng-container *ngFor="let cat of permissionMatrix">
                  <tr *ngFor="let perm of cat.permissions">
                    <td class="ps-4">
                      <code class="me-2">{{perm.code}}</code>
                      <span class="text-muted">{{perm.name}}</span>
                    </td>
                    <td class="text-center">
                      <input type="radio" class="form-check-input" [name]="perm.code" 
                             [checked]="perm.state === 'grant'" (change)="perm.state = 'grant'">
                    </td>
                    <td class="text-center">
                      <input type="radio" class="form-check-input" [name]="perm.code" 
                             [checked]="perm.state === 'deny'" (change)="perm.state = 'deny'">
                    </td>
                    <td class="text-center">
                      <input type="radio" class="form-check-input" [name]="perm.code" 
                             [checked]="perm.state === 'inherit'" (change)="perm.state = 'inherit'">
                    </td>
                  </tr>
                </ng-container>
              </tbody>
            </table>
          </div>

          <div class="d-flex justify-content-end mt-4">
            <button class="btn btn-primary">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`.role-permissions { padding: 1.5rem; }`]
})
export class RolePermissionsComponent {
  selectedRole = '1';
  roles = [
    { id: '1', name: 'Admin' },
    { id: '2', name: 'Moderator' },
    { id: '3', name: 'Editor' },
    { id: '4', name: 'Viewer' },
  ];

  permissionMatrix = [
    { category: 'Users', permissions: [
      { code: 'users.read', name: 'View Users', state: 'grant' },
      { code: 'users.write', name: 'Manage Users', state: 'grant' },
      { code: 'users.delete', name: 'Delete Users', state: 'deny' },
    ]},
    { category: 'Content', permissions: [
      { code: 'content.read', name: 'View Content', state: 'grant' },
      { code: 'content.write', name: 'Edit Content', state: 'grant' },
      { code: 'content.delete', name: 'Delete Content', state: 'inherit' },
    ]},
  ];
}
