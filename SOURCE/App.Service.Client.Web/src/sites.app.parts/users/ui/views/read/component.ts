import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users-read',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="users-read">
      <div class="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <a routerLink="../browse" class="btn btn-outline-secondary btn-sm me-3"><i class="bx bx-arrow-back"></i></a>
          <h4 class="d-inline-block mb-0"><i class="bx bx-user me-2 text-primary"></i>User Details</h4>
        </div>
        <a routerLink="edit" class="btn btn-primary btn-sm"><i class="bx bx-edit me-1"></i>Edit</a>
      </div>

      <div class="row">
        <div class="col-md-4">
          <div class="card">
            <div class="card-body text-center">
              <div class="avatar-xl mx-auto mb-3 bg-primary rounded-circle d-flex align-items-center justify-content-center">
                <span class="fs-1 text-white">JD</span>
              </div>
              <h5>John Doe</h5>
              <p class="text-muted">Administrator</p>
              <span class="badge bg-success">Active</span>
            </div>
          </div>
        </div>
        <div class="col-md-8">
          <div class="card">
            <div class="card-header"><h6 class="mb-0">User Information</h6></div>
            <div class="card-body">
              <dl class="row mb-0">
                <dt class="col-sm-3">Email</dt><dd class="col-sm-9">john&#64;example.com</dd>
                <dt class="col-sm-3">Phone</dt><dd class="col-sm-9">+1 234 567 8900</dd>
                <dt class="col-sm-3">Joined</dt><dd class="col-sm-9">January 15, 2024</dd>
                <dt class="col-sm-3">Last Login</dt><dd class="col-sm-9">2 hours ago</dd>
                <dt class="col-sm-3">Roles</dt><dd class="col-sm-9"><span class="badge bg-primary me-1">Admin</span><span class="badge bg-secondary">User</span></dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`.users-read { padding: 1.5rem; } .avatar-xl { width: 80px; height: 80px; }`]
})
export class UsersReadComponent {
  constructor(private route: ActivatedRoute) {}
}
