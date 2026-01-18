/**
 * Personal Profile Component
 * 
 * Manages user identity information:
 * - Avatar/profile picture
 * - Display name
 * - Bio/description
 * - First/Last name (optional)
 * 
 * Fields can be locked by account administrator.
 */
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../../../sites/ui/widgets/page-header';
import { BaseCoreAgPipesModule } from '../../../../../core.ag/pipes/module';
import { AccountService } from '../../../../../core/services/account.service';
import { OidcService } from '../../../../../core.ag/auth/services/oidc.service';

export interface PersonalProfileData {
  avatar: string;
  displayName: string;
  firstName: string;
  lastName: string;
  bio: string;
  email: string;
}

@Component({
  selector: 'app-personal-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, BaseCoreAgPipesModule],
  template: `
    <div class="personal-profile">
      <!-- Page Header -->
      <app-page-header 
        title="Personal Information"
        icon="bx-user"
        iconBackground="bg-primary-subtle"
        iconClass="text-primary"
        backFallback="system/profile">
        <ng-container subtitle>{{ 'BASE.PROFILE.PERSONAL.DESCRIPTION' | baseTranslate }}</ng-container>
        <ng-container actions>
          <button 
            type="button" 
            class="btn btn-primary"
            [disabled]="!hasChanges() || saving()"
            (click)="save()">
            @if (saving()) {
              <span class="spinner-border spinner-border-sm me-1"></span>
            }
            Save Changes
          </button>
        </ng-container>
      </app-page-header>

      <!-- Avatar Section -->
      <div class="card mb-4">
        <div class="card-header">
          <h6 class="mb-0">
            <i class="bx bx-image me-2"></i>
            Profile Picture
            @if (isFieldLocked('avatar')) {
              <i class="bx bx-lock-alt text-warning ms-2" title="Locked by administrator"></i>
            }
          </h6>
        </div>
        <div class="card-body">
          <div class="d-flex align-items-center gap-4">
            <div class="avatar-preview">
              @if (profile().avatar) {
                <img [src]="profile().avatar" alt="Profile" class="rounded-circle">
              } @else {
                <div class="avatar-placeholder rounded-circle bg-primary-subtle">
                  <span class="text-primary">{{ getInitials() }}</span>
                </div>
              }
            </div>
            <div class="flex-grow-1">
              <p class="text-muted mb-2">
                Upload a profile picture. Recommended size: 200x200 pixels.
              </p>
              <div class="d-flex gap-2">
                <button 
                  type="button" 
                  class="btn btn-soft-primary btn-sm"
                  [disabled]="isFieldLocked('avatar')"
                  (click)="selectAvatar()">
                  <i class="bx bx-upload me-1"></i>
                  Upload Photo
                </button>
                @if (profile().avatar) {
                  <button 
                    type="button" 
                    class="btn btn-soft-danger btn-sm"
                    [disabled]="isFieldLocked('avatar')"
                    (click)="removeAvatar()">
                    <i class="bx bx-trash me-1"></i>
                    Remove
                  </button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Name Section -->
      <div class="card mb-4">
        <div class="card-header">
          <h6 class="mb-0">
            <i class="bx bx-id-card me-2"></i>
            Name & Identity
          </h6>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <!-- Display Name -->
            <div class="col-12">
              <label class="form-label">
                Display Name
                @if (isFieldLocked('displayName')) {
                  <i class="bx bx-lock-alt text-warning ms-1" title="Locked by administrator"></i>
                }
              </label>
              <input 
                type="text" 
                class="form-control"
                [ngModel]="profile().displayName"
                (ngModelChange)="updateField('displayName', $event)"
                [disabled]="isFieldLocked('displayName')"
                placeholder="How you want to be called">
              <small class="text-muted">This is shown throughout the application</small>
            </div>
            
            <!-- First & Last Name -->
            <div class="col-md-6">
              <label class="form-label">
                First Name
                @if (isFieldLocked('firstName')) {
                  <i class="bx bx-lock-alt text-warning ms-1" title="Locked by administrator"></i>
                }
              </label>
              <input 
                type="text" 
                class="form-control"
                [ngModel]="profile().firstName"
                (ngModelChange)="updateField('firstName', $event)"
                [disabled]="isFieldLocked('firstName')">
            </div>
            <div class="col-md-6">
              <label class="form-label">
                Last Name
                @if (isFieldLocked('lastName')) {
                  <i class="bx bx-lock-alt text-warning ms-1" title="Locked by administrator"></i>
                }
              </label>
              <input 
                type="text" 
                class="form-control"
                [ngModel]="profile().lastName"
                (ngModelChange)="updateField('lastName', $event)"
                [disabled]="isFieldLocked('lastName')">
            </div>
            
            <!-- Email (read-only) -->
            <div class="col-12">
              <label class="form-label">
                Email Address
                <i class="bx bx-lock text-muted ms-1" title="Managed by identity provider"></i>
              </label>
              <input 
                type="email" 
                class="form-control"
                [value]="profile().email"
                disabled
                readonly>
              <small class="text-muted">Email is managed by your identity provider</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Bio Section -->
      <div class="card">
        <div class="card-header">
          <h6 class="mb-0">
            <i class="bx bx-text me-2"></i>
            About Me
            @if (isFieldLocked('bio')) {
              <i class="bx bx-lock-alt text-warning ms-1" title="Locked by administrator"></i>
            }
          </h6>
        </div>
        <div class="card-body">
          <textarea 
            class="form-control"
            rows="4"
            [ngModel]="profile().bio"
            (ngModelChange)="updateField('bio', $event)"
            [disabled]="isFieldLocked('bio')"
            placeholder="Tell others a bit about yourself..."></textarea>
          <small class="text-muted">
            {{ profile().bio?.length || 0 }} / 500 characters
          </small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .personal-profile {
      padding: 1.5rem;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .avatar-preview {
      width: 100px;
      height: 100px;
      flex-shrink: 0;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .avatar-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 600;
    }
  `]
})
export class PersonalProfileComponent implements OnInit {
  private accountService = inject(AccountService);
  private oidcService = inject(OidcService);
  
  profile = signal<PersonalProfileData>({
    avatar: '',
    displayName: '',
    firstName: '',
    lastName: '',
    bio: '',
    email: ''
  });
  
  originalProfile = signal<PersonalProfileData | null>(null);
  saving = signal(false);
  lockedFields = signal<string[]>([]);
  
  hasChanges = computed(() => {
    const original = this.originalProfile();
    const current = this.profile();
    if (!original) return false;
    return JSON.stringify(original) !== JSON.stringify(current);
  });
  
  ngOnInit(): void {
    this.loadProfile();
    this.loadLockedFields();
  }
  
  private loadProfile(): void {
    // Load from OIDC claims and local storage
    const user = this.oidcService.currentUser();
    
    // Start with OIDC data
    const profileData: PersonalProfileData = {
      avatar: user?.picture || '',
      displayName: user?.displayName || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: '',
      email: user?.email || ''
    };
    
    // Merge with local storage overrides
    const stored = localStorage.getItem('user-profile');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        Object.assign(profileData, parsed);
      } catch {
        // Use defaults
      }
    }
    
    this.profile.set(profileData);
    this.originalProfile.set({ ...profileData });
  }
  
  private loadLockedFields(): void {
    const config = this.accountService.getCurrentConfig();
    // TODO: Add profile.lockedFields to AccountConfig interface
    this.lockedFields.set((config as any)?.profile?.lockedFields || []);
  }
  
  isFieldLocked(fieldName: string): boolean {
    return this.lockedFields().includes(fieldName);
  }
  
  updateField<K extends keyof PersonalProfileData>(field: K, value: PersonalProfileData[K]): void {
    if (this.isFieldLocked(field)) return;
    
    this.profile.update(p => ({
      ...p,
      [field]: value
    }));
  }
  
  getInitials(): string {
    const p = this.profile();
    if (p.firstName && p.lastName) {
      return `${p.firstName[0]}${p.lastName[0]}`.toUpperCase();
    }
    if (p.displayName) {
      return p.displayName.substring(0, 2).toUpperCase();
    }
    return '?';
  }
  
  selectAvatar(): void {
    // TODO: Implement file picker
    console.log('[PersonalProfile] Select avatar - not yet implemented');
  }
  
  removeAvatar(): void {
    this.updateField('avatar', '');
  }
  
  async save(): Promise<void> {
    this.saving.set(true);
    
    try {
      // Save to local storage (in real app, would save to API)
      const { email, ...saveable } = this.profile();
      localStorage.setItem('user-profile', JSON.stringify(saveable));
      
      // Update original to reset hasChanges
      this.originalProfile.set({ ...this.profile() });
      
      console.log('[PersonalProfile] Saved profile', saveable);
    } finally {
      this.saving.set(false);
    }
  }
}
