import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users-add',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="users-add">
      <div class="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3"><i class="bx bx-arrow-back"></i></a>
          <h4 class="d-inline-block mb-0"><i class="bx bx-user-plus me-2 text-success"></i>Add User</h4>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <form>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">First Name</label>
                <input type="text" class="form-control" [(ngModel)]="user.firstName" name="firstName">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Last Name</label>
                <input type="text" class="form-control" [(ngModel)]="user.lastName" name="lastName">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" [(ngModel)]="user.email" name="email">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Phone</label>
                <input type="tel" class="form-control" [(ngModel)]="user.phone" name="phone">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Status</label>
                <select class="form-select" [(ngModel)]="user.status" name="status">
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Roles</label>
                <select class="form-select" [(ngModel)]="user.role" name="role">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>
            </div>
            <div class="d-flex justify-content-end gap-2">
              <a routerLink="../" class="btn btn-outline-secondary">Cancel</a>
              <button type="submit" class="btn btn-primary">Create User</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`.users-add { padding: 1.5rem; }`]
})
export class UsersAddComponent {
  user = { firstName: '', lastName: '', email: '', phone: '', status: 'active', role: 'user' };
}
