import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { SystemProfileService } from '../../../services/system-profile.service';

/**
 * System Profile Edit Component
 * 
 * Edit cross-account user preferences.
 */
@Component({
    selector: 'app-system-profile-edit',
    imports: [FormsModule],
    template: `
    <div class="system-profile-page">
      <div class="page-header mb-4">
        <h2>
          <i class="ri-user-settings-line me-2 text-primary"></i>
          System Profile
        </h2>
        <p class="text-muted">Your global preferences across all accounts.</p>
      </div>
      
      @if (profileService.loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>
      } @else {
        @if (profile; as p) {
          <!-- Display Preferences -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="ri-palette-line me-2"></i>
                Display Preferences
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Theme</label>
                  <select class="form-select" 
                          [ngModel]="p.theme"
                          (ngModelChange)="updateTheme($event)">
                    <option value="system">System (Auto)</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Language</label>
                  <select class="form-select"
                          [ngModel]="p.languageCode"
                          (ngModelChange)="updateLanguage($event)">
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Font Size</label>
                  <select class="form-select"
                          [ngModel]="p.fontSize"
                          (ngModelChange)="updateFontSize($event)">
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="x-large">Extra Large</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Timezone</label>
                  <input type="text" class="form-control" 
                         [value]="p.timezone" readonly>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Accessibility -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="ri-wheelchair-line me-2"></i>
                Accessibility
              </h5>
            </div>
            <div class="card-body">
              <div class="form-check form-switch mb-3">
                <input class="form-check-input" type="checkbox" 
                       [checked]="p.reduceMotion"
                       (change)="toggleReduceMotion()">
                <label class="form-check-label">
                  Reduce Motion
                  <small class="d-block text-muted">Minimize animations and transitions</small>
                </label>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox"
                       [checked]="p.highContrast"
                       (change)="toggleHighContrast()">
                <label class="form-check-label">
                  High Contrast
                  <small class="d-block text-muted">Increase color contrast for better visibility</small>
                </label>
              </div>
            </div>
          </div>
          
          <!-- Notifications -->
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="ri-notification-line me-2"></i>
                Notifications
              </h5>
            </div>
            <div class="card-body">
              <div class="form-check form-switch mb-3">
                <input class="form-check-input" type="checkbox"
                       [checked]="p.emailNotifications"
                       (change)="toggleEmailNotifications()">
                <label class="form-check-label">Email Notifications</label>
              </div>
              <div class="form-check form-switch mb-3">
                <input class="form-check-input" type="checkbox"
                       [checked]="p.pushNotifications"
                       (change)="togglePushNotifications()">
                <label class="form-check-label">Push Notifications</label>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox"
                       [checked]="p.marketingEmails"
                       (change)="toggleMarketingEmails()">
                <label class="form-check-label">
                  Marketing Emails
                  <small class="d-block text-muted">Receive updates about new features and offers</small>
                </label>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `,
    styles: [`
    .system-profile-page { padding: 1.5rem; }
  `]
})
export class SystemProfileEditComponent implements OnInit {
  
  constructor(public profileService: SystemProfileService) {}
  
  get profile() {
    return this.profileService.profile();
  }
  
  ngOnInit(): void {
    this.profileService.loadProfile();
  }
  
  updateTheme(theme: 'light' | 'dark' | 'system'): void {
    this.profileService.setTheme(theme).subscribe();
  }
  
  updateLanguage(code: string): void {
    this.profileService.setLanguage(code).subscribe();
  }
  
  updateFontSize(size: 'small' | 'medium' | 'large' | 'x-large'): void {
    this.profileService.updateProfile({ fontSize: size }).subscribe();
  }
  
  toggleReduceMotion(): void {
    const current = this.profileService.profile()?.reduceMotion || false;
    this.profileService.updateProfile({ reduceMotion: !current }).subscribe();
  }
  
  toggleHighContrast(): void {
    const current = this.profileService.profile()?.highContrast || false;
    this.profileService.updateProfile({ highContrast: !current }).subscribe();
  }
  
  toggleEmailNotifications(): void {
    const current = this.profileService.profile()?.emailNotifications || false;
    this.profileService.updateProfile({ emailNotifications: !current }).subscribe();
  }
  
  togglePushNotifications(): void {
    const current = this.profileService.profile()?.pushNotifications || false;
    this.profileService.updateProfile({ pushNotifications: !current }).subscribe();
  }
  
  toggleMarketingEmails(): void {
    const current = this.profileService.profile()?.marketingEmails || false;
    this.profileService.updateProfile({ marketingEmails: !current }).subscribe();
  }
}
