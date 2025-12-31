import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Authorisation Hub Component
 * 
 * Entry point for authorization management.
 */
@Component({
  selector: 'app-authorisation-hub',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="authorisation-hub">
      <div class="page-header mb-4">
        <h2><i class="bx bx-shield me-2 text-primary"></i>Authorization Management</h2>
        <p class="text-muted">Manage roles, permissions, and access control</p>
      </div>

      <div class="row">
        <div class="col-md-4 mb-4" *ngFor="let item of sections">
          <div class="card h-100 section-card" [routerLink]="item.route">
            <div class="card-body">
              <div class="section-icon mb-3" [style.background-color]="item.color">
                <i class="bx {{item.icon}}"></i>
              </div>
              <h5>{{item.title}}</h5>
              <p class="text-muted small mb-2">{{item.description}}</p>
              <span class="badge bg-light text-dark">{{item.count}} items</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <a routerLink="/system" class="btn btn-outline-secondary">
          <i class="bx bx-arrow-back me-1"></i>Back to System
        </a>
      </div>
    </div>
  `,
  styles: [`
    .authorisation-hub { padding: 1.5rem; max-width: 1200px; margin: 0 auto; }
    .section-card { cursor: pointer; transition: all 0.2s; }
    .section-card:hover { border-color: var(--vz-primary); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .section-icon { width: 50px; height: 50px; border-radius: 0.5rem; display: inline-flex; align-items: center; justify-content: center; }
    .section-icon i { font-size: 1.25rem; color: white; }
  `]
})
export class AuthorisationHubComponent {
  sections = [
    { title: 'System Roles', description: 'Define roles with permission sets', icon: 'bx-briefcase-alt', color: '#3577f1', route: 'roles', count: 5 },
    { title: 'System Permissions', description: 'Granular access permissions', icon: 'bx-key', color: '#0ab39c', route: 'permissions', count: 42 },
    { title: 'System Groups', description: 'Security groups for access control', icon: 'bx-group', color: '#f7b84b', route: 'groups', count: 8 },
    { title: 'User Assignments', description: 'Assign roles to users', icon: 'bx-user-check', color: '#405189', route: 'user-roles', count: 156 },
    { title: 'Permission Overrides', description: 'Direct user permission grants', icon: 'bx-shield-alt-2', color: '#f06548', route: 'user-permissions', count: 12 },
  ];
}
