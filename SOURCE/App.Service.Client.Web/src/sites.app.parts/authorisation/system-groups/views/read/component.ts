import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-system-groups-read',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="groups-read">
      <div class="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3"><i class="bx bx-arrow-back"></i></a>
          <h4 class="d-inline-block mb-0"><i class="bx bx-group me-2 text-warning"></i>Administrators</h4>
        </div>
        <a routerLink="edit" class="btn btn-primary btn-sm"><i class="bx bx-edit me-1"></i>Edit</a>
      </div>

      <div class="row">
        <div class="col-md-4">
          <div class="card">
            <div class="card-header"><h6 class="mb-0">Group Details</h6></div>
            <div class="card-body">
              <p class="text-muted">Full system access for administrators.</p>
              <dl class="mb-0">
                <dt>Created</dt><dd class="text-muted">January 1, 2024</dd>
                <dt>Members</dt><dd><span class="badge bg-primary">3 users</span></dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="col-md-8">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h6 class="mb-0">Members</h6>
              <button class="btn btn-sm btn-outline-primary"><i class="bx bx-plus me-1"></i>Add Member</button>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center" *ngFor="let member of members">
                  <div>
                    <strong>{{member.name}}</strong>
                    <span class="text-muted ms-2">{{member.email}}</span>
                  </div>
                  <button class="btn btn-sm btn-outline-danger"><i class="bx bx-x"></i></button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`.groups-read { padding: 1.5rem; }`]
})
export class SystemGroupsReadComponent {
  members = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' },
    { name: 'Admin User', email: 'admin@example.com' },
  ];
  constructor(private route: ActivatedRoute) {}
}
