import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-system-permissions-add',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="permissions-add">
      <div class="page-header mb-4">
        <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3"><i class="bx bx-arrow-back"></i></a>
        <h4 class="d-inline-block mb-0"><i class="bx bx-plus me-2 text-success"></i>Add Permission</h4>
      </div>

      <div class="card">
        <div class="card-body">
          <form>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Permission Code</label>
                <input type="text" class="form-control" [(ngModel)]="perm.code" name="code" placeholder="e.g., users.delete">
                <small class="text-muted">Unique identifier (lowercase, dots for hierarchy)</small>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Display Name</label>
                <input type="text" class="form-control" [(ngModel)]="perm.name" name="name" placeholder="e.g., Delete Users">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Category</label>
                <select class="form-select" [(ngModel)]="perm.category" name="category">
                  <option value="Users">Users</option>
                  <option value="Content">Content</option>
                  <option value="Settings">Settings</option>
                  <option value="Reports">Reports</option>
                </select>
              </div>
              <div class="col-12 mb-3">
                <label class="form-label">Description</label>
                <textarea class="form-control" rows="2" [(ngModel)]="perm.description" name="description"></textarea>
              </div>
            </div>
            <div class="d-flex justify-content-end gap-2">
              <a routerLink="../" class="btn btn-outline-secondary">Cancel</a>
              <button type="submit" class="btn btn-primary">Create Permission</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`.permissions-add { padding: 1.5rem; }`]
})
export class SystemPermissionsAddComponent {
  perm = { code: '', name: '', category: 'Users', description: '' };
}
