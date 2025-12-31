import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountProfileService } from '../../services/account-profile.service';

/**
 * Account Profile Edit Component
 * 
 * Edit per-account user preferences.
 */
@Component({
    selector: 'app-account-profile-edit',
    imports: [CommonModule, FormsModule],
    template: `
    <div class="account-profile-page">
      <div class="page-header mb-4">
        <h2>
          <i class="ri-building-line me-2 text-primary"></i>
          Account Profile
        </h2>
        <p class="text-muted">Your preferences for the current account.</p>
      </div>
      
      @if (profileService.loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>
      } @else {
        @if (profile; as p) {
          <!-- Membership Info -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="ri-team-line me-2"></i>
                Membership
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-4">
                  <label class="text-muted small">Status</label>
                  <div>
                    <span class="badge" [class]="p.membershipStatusClass">
                      {{ p.membershipStatus | titlecase }}
                    </span>
                  </div>
                </div>
                <div class="col-md-4">
                  <label class="text-muted small">Member Since</label>
                  <div>{{ p.joinedAt | date:'mediumDate' }}</div>
                </div>
                <div class="col-md-4">
                  <label class="text-muted small">Duration</label>
                  <div>{{ p.memberDuration }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Identity in this Account -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="ri-profile-line me-2"></i>
                Your Identity in This Account
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Display Name Override</label>
                  <input type="text" class="form-control"
                         [ngModel]="p.displayNameOverride"
                         (ngModelChange)="updateDisplayName($event)"
                         placeholder="Use default name">
                  <small class="text-muted">Leave empty to use your Person name</small>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Job Title</label>
                  <input type="text" class="form-control"
                         [ngModel]="p.jobTitle"
                         (ngModelChange)="updateJobTitle($event)"
                         placeholder="Your role in this account">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Department</label>
                  <input type="text" class="form-control"
                         [ngModel]="p.department"
                         (ngModelChange)="updateDepartment($event)"
                         placeholder="Your department">
                </div>
              </div>
            </div>
          </div>
          
          <!-- UI Preferences -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="ri-layout-line me-2"></i>
                Dashboard Layout
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Layout Style</label>
                  <select class="form-select"
                          [ngModel]="p.dashboardLayout"
                          (ngModelChange)="updateDashboardLayout($event)">
                    <option value="default">Default</option>
                    <option value="compact">Compact</option>
                    <option value="detailed">Detailed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Account Notifications -->
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="ri-notification-line me-2"></i>
                Notifications for This Account
              </h5>
            </div>
            <div class="card-body">
              <div class="form-check form-switch mb-3">
                <input class="form-check-input" type="checkbox"
                       [checked]="p.notificationsEnabled"
                       (change)="toggleNotifications()">
                <label class="form-check-label">Enable Notifications</label>
              </div>
              @if (p.notificationsEnabled) {
                <div class="row">
                  <div class="col-md-6">
                    <label class="form-label">Digest Frequency</label>
                    <select class="form-select"
                            [ngModel]="p.notificationDigest"
                            (ngModelChange)="updateDigest($event)">
                      <option value="realtime">Real-time</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Digest</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
              }
            </div>
          </div>
        } @else {
          <div class="alert alert-warning">
            <i class="ri-information-line me-2"></i>
            No account selected. Please select an account from the account switcher.
          </div>
        }
      }
    </div>
  `,
    styles: [`
    .account-profile-page { padding: 1.5rem; }
  `]
})
export class AccountProfileEditComponent implements OnInit {
  
  constructor(public profileService: AccountProfileService) {}
  
  get profile() {
    return this.profileService.currentProfile();
  }
  
  ngOnInit(): void {
    this.profileService.loadProfiles();
  }
  
  updateDisplayName(value: string): void {
    const p = this.profileService.currentProfile();
    if (p) {
      this.profileService.updateProfile(p.id, { 
        displayNameOverride: value || null 
      }).subscribe();
    }
  }
  
  updateJobTitle(value: string): void {
    const p = this.profileService.currentProfile();
    if (p) {
      this.profileService.updateProfile(p.id, { 
        jobTitle: value || null 
      }).subscribe();
    }
  }
  
  updateDepartment(value: string): void {
    const p = this.profileService.currentProfile();
    if (p) {
      this.profileService.updateProfile(p.id, { 
        department: value || null 
      }).subscribe();
    }
  }
  
  updateDashboardLayout(layout: 'default' | 'compact' | 'detailed'): void {
    const p = this.profileService.currentProfile();
    if (p) {
      this.profileService.updateProfile(p.id, { dashboardLayout: layout }).subscribe();
    }
  }
  
  toggleNotifications(): void {
    const p = this.profileService.currentProfile();
    if (p) {
      this.profileService.updateProfile(p.id, { 
        notificationsEnabled: !p.notificationsEnabled 
      }).subscribe();
    }
  }
  
  updateDigest(digest: 'realtime' | 'daily' | 'weekly' | 'none'): void {
    const p = this.profileService.currentProfile();
    if (p) {
      this.profileService.updateProfile(p.id, { notificationDigest: digest }).subscribe();
    }
  }
}
