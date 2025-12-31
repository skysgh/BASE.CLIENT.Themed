import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-system-groups-browse',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="groups-browse">
      <div class="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3"><i class="bx bx-arrow-back"></i></a>
          <h4 class="d-inline-block mb-0"><i class="bx bx-group me-2 text-warning"></i>System Groups</h4>
        </div>
        <a routerLink="add" class="btn btn-primary btn-sm"><i class="bx bx-plus me-1"></i>Add Group</a>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr><th>Name</th><th>Description</th><th>Members</th><th>Created</th><th>Actions</th></tr>
              </thead>
              <tbody>
                <tr *ngFor="let group of groups" [routerLink]="[group.id]" style="cursor: pointer;">
                  <td><strong>{{group.name}}</strong></td>
                  <td class="text-muted">{{group.description}}</td>
                  <td><span class="badge bg-primary">{{group.memberCount}}</span></td>
                  <td class="text-muted small">{{group.created}}</td>
                  <td>
                    <a [routerLink]="[group.id, 'edit']" class="btn btn-sm btn-outline-primary" (click)="$event.stopPropagation()">
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
  styles: [`.groups-browse { padding: 1.5rem; }`]
})
export class SystemGroupsBrowseComponent {
  groups = [
    { id: '1', name: 'Administrators', description: 'Full system access', memberCount: 3, created: 'Jan 1, 2024' },
    { id: '2', name: 'Moderators', description: 'Content moderation access', memberCount: 8, created: 'Jan 5, 2024' },
    { id: '3', name: 'Support Staff', description: 'Customer support access', memberCount: 12, created: 'Jan 10, 2024' },
    { id: '4', name: 'Viewers', description: 'Read-only access', memberCount: 45, created: 'Jan 15, 2024' },
  ];
}
