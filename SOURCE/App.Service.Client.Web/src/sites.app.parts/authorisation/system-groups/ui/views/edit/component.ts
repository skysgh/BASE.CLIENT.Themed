import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-system-groups-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="groups-edit">
      <div class="page-header mb-4">
        <a routerLink="../../" class="btn btn-outline-secondary btn-sm me-3"><i class="bx bx-arrow-back"></i></a>
        <h4 class="d-inline-block mb-0"><i class="bx bx-edit me-2 text-warning"></i>Edit System Group</h4>
      </div>

      <div class="card">
        <div class="card-body">
          <form>
            <div class="mb-3">
              <label class="form-label">Group Name</label>
              <input type="text" class="form-control" [(ngModel)]="group.name" name="name">
            </div>
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea class="form-control" rows="3" [(ngModel)]="group.description" name="description"></textarea>
            </div>
            <div class="d-flex justify-content-end gap-2">
              <a routerLink="../../" class="btn btn-outline-secondary">Cancel</a>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`.groups-edit { padding: 1.5rem; }`]
})
export class SystemGroupsEditComponent {
  group = { name: 'Administrators', description: 'Full system access for administrators.' };
}
