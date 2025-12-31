import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-system-roles-read',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="roles-read">
      <div class="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3"><i class="bx bx-arrow-back"></i></a>
          <h4 class="d-inline-block mb-0"><i class="bx bx-briefcase-alt me-2 text-primary"></i>{{role.name}}</h4>
          <span class="badge bg-secondary ms-2">System Role</span>
        </div>
        <a routerLink="edit" class="btn btn-primary btn-sm"><i class="bx bx-edit me-1"></i>Edit</a>
      </div>

      <div class="row">
        <div class="col-md-4 mb-4">
          <div class="card">
            <div class="card-header"><h6 class="mb-0">Role Details</h6></div>
            <div class="card-body">
              <p class="text-muted">{{role.description}}</p>
              <dl class="mb-0">
                <dt>Users with Role</dt><dd><span class="badge bg-primary">2 users</span></dd>
                <dt>Permissions</dt><dd><span class="badge bg-success">42 permissions</span></dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="col-md-8 mb-4">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h6 class="mb-0">Permissions</h6>
              <button class="btn btn-sm btn-outline-primary"><i class="bx bx-plus me-1"></i>Add Permission</button>
            </div>
            <div class="card-body">
              <div *ngFor="let cat of permissionCategories" class="mb-3">
                <h6 class="text-muted small text-uppercase">{{cat.name}}</h6>
                <div class="d-flex flex-wrap gap-2">
                  <span *ngFor="let perm of cat.permissions" class="badge" 
                        [class.bg-success]="perm.granted" 
                        [class.bg-danger]="!perm.granted">
                    <i class="bx me-1" [class.bx-check]="perm.granted" [class.bx-x]="!perm.granted"></i>
                    {{perm.name}}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`.roles-read { padding: 1.5rem; }`]
})
export class SystemRolesReadComponent {
  role = { name: 'Super Admin', description: 'Full system access with all permissions' };
  
  permissionCategories = [
    { name: 'Users', permissions: [
      { name: 'users.read', granted: true },
      { name: 'users.write', granted: true },
      { name: 'users.delete', granted: true },
    ]},
    { name: 'Content', permissions: [
      { name: 'content.read', granted: true },
      { name: 'content.write', granted: true },
      { name: 'content.delete', granted: true },
    ]},
    { name: 'Settings', permissions: [
      { name: 'settings.read', granted: true },
      { name: 'settings.write', granted: true },
    ]},
  ];

  constructor(private route: ActivatedRoute) {}
}
