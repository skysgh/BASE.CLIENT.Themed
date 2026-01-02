import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-system-permissions-browse',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="permissions-browse">
      <div class="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3"><i class="bx bx-arrow-back"></i></a>
          <h4 class="d-inline-block mb-0"><i class="bx bx-key me-2 text-success"></i>System Permissions</h4>
        </div>
        <a routerLink="add" class="btn btn-primary btn-sm"><i class="bx bx-plus me-1"></i>Add Permission</a>
      </div>

      <!-- Filter by Category -->
      <div class="card mb-3">
        <div class="card-body py-2">
          <div class="d-flex gap-2 flex-wrap">
            <button class="btn btn-sm" [class.btn-primary]="selectedCategory === 'all'" 
                    [class.btn-outline-primary]="selectedCategory !== 'all'" 
                    (click)="selectedCategory = 'all'">All</button>
            <button *ngFor="let cat of categories" class="btn btn-sm" 
                    [class.btn-primary]="selectedCategory === cat" 
                    [class.btn-outline-primary]="selectedCategory !== cat"
                    (click)="selectedCategory = cat">{{cat}}</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr><th>Code</th><th>Name</th><th>Category</th><th>Description</th><th>Actions</th></tr>
              </thead>
              <tbody>
                <tr *ngFor="let perm of filteredPermissions" [routerLink]="[perm.id]" style="cursor: pointer;">
                  <td><code>{{perm.code}}</code></td>
                  <td><strong>{{perm.name}}</strong></td>
                  <td><span class="badge bg-info-subtle text-info">{{perm.category}}</span></td>
                  <td class="text-muted small">{{perm.description}}</td>
                  <td>
                    <a [routerLink]="[perm.id, 'edit']" class="btn btn-sm btn-outline-primary" (click)="$event.stopPropagation()">
                      <i class="bx bx-edit"></i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`.permissions-browse { padding: 1.5rem; }`]
})
export class SystemPermissionsBrowseComponent {
  selectedCategory = 'all';
  categories = ['Users', 'Content', 'Settings', 'Reports'];
  
  permissions = [
    { id: '1', code: 'users.read', name: 'View Users', category: 'Users', description: 'View user list and details' },
    { id: '2', code: 'users.write', name: 'Manage Users', category: 'Users', description: 'Create, edit, delete users' },
    { id: '3', code: 'content.read', name: 'View Content', category: 'Content', description: 'View all content' },
    { id: '4', code: 'content.write', name: 'Edit Content', category: 'Content', description: 'Create and edit content' },
    { id: '5', code: 'content.delete', name: 'Delete Content', category: 'Content', description: 'Delete content' },
    { id: '6', code: 'settings.read', name: 'View Settings', category: 'Settings', description: 'View system settings' },
    { id: '7', code: 'settings.write', name: 'Manage Settings', category: 'Settings', description: 'Modify system settings' },
    { id: '8', code: 'reports.view', name: 'View Reports', category: 'Reports', description: 'Access reporting dashboard' },
  ];

  get filteredPermissions() {
    return this.selectedCategory === 'all' 
      ? this.permissions 
      : this.permissions.filter(p => p.category === this.selectedCategory);
  }
}
