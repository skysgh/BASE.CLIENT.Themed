import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="users-settings">
      <div class="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3"><i class="bx bx-arrow-back"></i></a>
          <h4 class="d-inline-block mb-0"><i class="bx bx-cog me-2 text-secondary"></i>User Settings</h4>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h6 class="mb-0">Registration Settings</h6></div>
        <div class="card-body">
          <div class="form-check form-switch mb-3">
            <input class="form-check-input" type="checkbox" id="allowRegistration" checked>
            <label class="form-check-label" for="allowRegistration">Allow self-registration</label>
          </div>
          <div class="form-check form-switch mb-3">
            <input class="form-check-input" type="checkbox" id="emailVerification" checked>
            <label class="form-check-label" for="emailVerification">Require email verification</label>
          </div>
          <div class="form-check form-switch mb-3">
            <input class="form-check-input" type="checkbox" id="adminApproval">
            <label class="form-check-label" for="adminApproval">Require admin approval</label>
          </div>
        </div>
      </div>

      <div class="card mt-4">
        <div class="card-header"><h6 class="mb-0">Default User Settings</h6></div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label">Default Role for New Users</label>
            <select class="form-select" style="max-width: 300px;">
              <option value="user">User</option>
              <option value="guest">Guest</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Default Status</label>
            <select class="form-select" style="max-width: 300px;">
              <option value="active">Active</option>
              <option value="pending">Pending Verification</option>
            </select>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-end mt-4">
        <button class="btn btn-primary">Save Settings</button>
      </div>
    </div>
  `,
  styles: [`.users-settings { padding: 1.5rem; }`]
})
export class UsersSettingsComponent {}
