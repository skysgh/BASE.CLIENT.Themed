import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users-search',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="users-search">
      <div class="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3"><i class="bx bx-arrow-back"></i></a>
          <h4 class="d-inline-block mb-0"><i class="bx bx-search-alt me-2 text-primary"></i>Advanced Search</h4>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-body">
          <form class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Name</label>
              <input type="text" class="form-control" placeholder="Search by name...">
            </div>
            <div class="col-md-4">
              <label class="form-label">Email</label>
              <input type="text" class="form-control" placeholder="Search by email...">
            </div>
            <div class="col-md-4">
              <label class="form-label">Status</label>
              <select class="form-select">
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Role</label>
              <select class="form-select">
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Created After</label>
              <input type="date" class="form-control">
            </div>
            <div class="col-md-4">
              <label class="form-label">Created Before</label>
              <input type="date" class="form-control">
            </div>
            <div class="col-12">
              <button type="submit" class="btn btn-primary"><i class="bx bx-search me-1"></i>Search</button>
              <button type="reset" class="btn btn-outline-secondary ms-2">Reset</button>
            </div>
          </form>
        </div>
      </div>

      <div class="card">
        <div class="card-body text-center text-muted py-5">
          <i class="bx bx-search fs-1 mb-2"></i>
          <p class="mb-0">Enter search criteria above to find users</p>
        </div>
      </div>
    </div>
  `,
  styles: [`.users-search { padding: 1.5rem; }`]
})
export class UsersSearchComponent {}
