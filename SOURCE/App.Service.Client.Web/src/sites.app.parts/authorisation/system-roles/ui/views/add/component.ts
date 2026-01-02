import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-system-roles-add',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="roles-add">
      <div class="page-header mb-4">
        <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3"><i class="bx bx-arrow-back"></i></a>
        <h4 class="d-inline-block mb-0"><i class="bx bx-plus me-2 text-success"></i>Add Role</h4>
      </div>

      <div class="card">
        <div class="card-body">
          <form>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Role Name</label>
                <input type="text" class="form-control" [(ngModel)]="role.name" name="name" placeholder="e.g., Content Manager">
              </div>
              <div class="col-12 mb-3">
                <label class="form-label">Description</label>
                <textarea class="form-control" rows="2" [(ngModel)]="role.description" name="description" placeholder="Describe what this role is for..."></textarea>
              </div>
            </div>

            <h6 class="mt-4 mb-3">Assign Permissions</h6>
            <div class="border rounded p-3 mb-4">
              <div *ngFor="let cat of availablePermissions" class="mb-3">
                <h6 class="text-muted small text-uppercase">{{cat.name}}</h6>
                <div class="row">
                  <div class="col-md-4" *ngFor="let perm of cat.permissions">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" [id]="perm.code" [(ngModel)]="perm.selected" [name]="perm.code">
                      <label class="form-check-label" [for]="perm.code">{{perm.name}}</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-end gap-2">
              <a routerLink="../" class="btn btn-outline-secondary">Cancel</a>
              <button type="submit" class="btn btn-primary">Create Role</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`.roles-add { padding: 1.5rem; }`]
})
export class SystemRolesAddComponent {
  role = { name: '', description: '' };
  
  availablePermissions = [
    { name: 'Users', permissions: [
      { code: 'users.read', name: 'View Users', selected: false },
      { code: 'users.write', name: 'Manage Users', selected: false },
      { code: 'users.delete', name: 'Delete Users', selected: false },
    ]},
    { name: 'Content', permissions: [
      { code: 'content.read', name: 'View Content', selected: false },
      { code: 'content.write', name: 'Edit Content', selected: false },
      { code: 'content.delete', name: 'Delete Content', selected: false },
    ]},
  ];
}
