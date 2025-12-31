import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-users-browse',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="users-browse">
      <div class="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3"><i class="bx bx-arrow-back"></i></a>
          <h4 class="d-inline-block mb-0"><i class="bx bx-list-ul me-2 text-primary"></i>Browse Users</h4>
        </div>
        <div>
          <a routerLink="../add" class="btn btn-primary btn-sm"><i class="bx bx-plus me-1"></i>Add User</a>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Roles</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of users" [routerLink]="['../', user.id]" style="cursor: pointer;">
                  <td>{{user.name}}</td>
                  <td>{{user.email}}</td>
                  <td><span class="badge" [class]="'bg-' + user.statusClass">{{user.status}}</span></td>
                  <td>{{user.roles.join(', ')}}</td>
                  <td>
                    <a [routerLink]="['../', user.id, 'edit']" class="btn btn-sm btn-outline-primary" (click)="$event.stopPropagation()">
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
  styles: [`.users-browse { padding: 1.5rem; }`]
})
export class UsersBrowseComponent {
  users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', status: 'Active', statusClass: 'success', roles: ['Admin'] },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'Active', statusClass: 'success', roles: ['User'] },
    { id: '3', name: 'Bob Wilson', email: 'bob@example.com', status: 'Pending', statusClass: 'warning', roles: ['User'] },
  ];
}
