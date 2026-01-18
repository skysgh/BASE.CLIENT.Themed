/**
 * Security Profile Component
 * 
 * Manages user security settings:
 * - Password change
 * - Multi-factor authentication (MFA)
 * - Active sessions
 * - Linked identity providers
 * 
 * Note: Much of this delegates to the identity provider (IdP).
 * For self-managed passwords, we show a change form.
 * For federated identities, we redirect to the IdP.
 */
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../../../sites/ui/widgets/page-header';
import { BaseCoreAgPipesModule } from '../../../../../core.ag/pipes/module';
import { AccountService } from '../../../../../core/services/account.service';
import { OidcService } from '../../../../../core.ag/auth/services/oidc.service';

interface LinkedIdentity {
  provider: string;
  providerName: string;
  icon: string;
  email: string;
  connectedAt: Date;
  isPrimary: boolean;
}

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: Date;
  isCurrent: boolean;
}

@Component({
  selector: 'app-security-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, BaseCoreAgPipesModule],
  template: `
    <div class="security-profile">
      <!-- Page Header -->
      <app-page-header 
        title="Security"
        icon="bx-shield-quarter"
        iconBackground="bg-success-subtle"
        iconClass="text-success"
        backFallback="system/profile">
        <ng-container subtitle>{{ 'BASE.PROFILE.SECURITY.DESCRIPTION' | baseTranslate }}</ng-container>
      </app-page-header>

      <!-- Password Section -->
      <div class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h6 class="mb-0">
            <i class="bx bx-key me-2"></i>
            Password
            @if (isFieldLocked('password')) {
              <i class="bx bx-lock-alt text-warning ms-2" title="Locked by administrator"></i>
            }
          </h6>
          @if (isFederatedIdentity()) {
            <span class="badge bg-info-subtle text-info">Managed by {{ identityProvider() }}</span>
          }
        </div>
        <div class="card-body">
          @if (isFederatedIdentity()) {
            <p class="text-muted mb-3">
              Your password is managed by {{ identityProvider() }}. 
              To change it, visit your identity provider's settings.
            </p>
            <a [href]="idpPasswordUrl()" target="_blank" class="btn btn-outline-primary btn-sm">
              <i class="bx bx-link-external me-1"></i>
              Manage at {{ identityProvider() }}
            </a>
          } @else {
            <form (ngSubmit)="changePassword()">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Current Password</label>
                  <input 
                    type="password" 
                    class="form-control"
                    [(ngModel)]="passwordForm.current"
                    name="current"
                    [disabled]="isFieldLocked('password')"
                    required>
                </div>
                <div class="col-md-6"></div>
                <div class="col-md-6">
                  <label class="form-label">New Password</label>
                  <input 
                    type="password" 
                    class="form-control"
                    [(ngModel)]="passwordForm.new"
                    name="new"
                    [disabled]="isFieldLocked('password')"
                    required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Confirm New Password</label>
                  <input 
                    type="password" 
                    class="form-control"
                    [(ngModel)]="passwordForm.confirm"
                    name="confirm"
                    [disabled]="isFieldLocked('password')"
                    required>
                </div>
                <div class="col-12">
                  <button 
                    type="submit" 
                    class="btn btn-primary btn-sm"
                    [disabled]="isFieldLocked('password') || !isPasswordFormValid()">
                    Change Password
                  </button>
                </div>
              </div>
            </form>
          }
        </div>
      </div>

      <!-- MFA Section -->
      <div class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h6 class="mb-0">
            <i class="bx bx-shield-x me-2"></i>
            Two-Factor Authentication
            @if (isFieldLocked('mfa')) {
              <i class="bx bx-lock-alt text-warning ms-2" title="Locked by administrator"></i>
            }
          </h6>
          @if (mfaEnabled()) {
            <span class="badge bg-success">Enabled</span>
          } @else {
            <span class="badge bg-warning text-dark">Not Enabled</span>
          }
        </div>
        <div class="card-body">
          @if (isFederatedIdentity()) {
            <p class="text-muted mb-3">
              Two-factor authentication is managed by {{ identityProvider() }}.
            </p>
            <a [href]="idpMfaUrl()" target="_blank" class="btn btn-outline-primary btn-sm">
              <i class="bx bx-link-external me-1"></i>
              Manage at {{ identityProvider() }}
            </a>
          } @else {
            <p class="text-muted mb-3">
              Add an extra layer of security to your account by enabling two-factor authentication.
            </p>
            @if (mfaEnabled()) {
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-outline-secondary btn-sm">
                  <i class="bx bx-cog me-1"></i>
                  Manage Methods
                </button>
                <button 
                  type="button" 
                  class="btn btn-outline-danger btn-sm"
                  [disabled]="isFieldLocked('mfa')">
                  Disable 2FA
                </button>
              </div>
            } @else {
              <button 
                type="button" 
                class="btn btn-success btn-sm"
                [disabled]="isFieldLocked('mfa')"
                (click)="setupMfa()">
                <i class="bx bx-shield-plus me-1"></i>
                Enable 2FA
              </button>
            }
          }
        </div>
      </div>

      <!-- Linked Identities Section -->
      <div class="card mb-4">
        <div class="card-header">
          <h6 class="mb-0">
            <i class="bx bx-link me-2"></i>
            Linked Accounts
          </h6>
        </div>
        <div class="card-body">
          @if (linkedIdentities().length === 0) {
            <p class="text-muted mb-0">No linked identity providers.</p>
          } @else {
            <div class="list-group list-group-flush">
              @for (identity of linkedIdentities(); track identity.provider) {
                <div class="list-group-item d-flex align-items-center px-0">
                  <div class="identity-icon me-3">
                    <i class="bx {{ identity.icon }} fs-4"></i>
                  </div>
                  <div class="flex-grow-1">
                    <div class="d-flex align-items-center">
                      <strong>{{ identity.providerName }}</strong>
                      @if (identity.isPrimary) {
                        <span class="badge bg-primary-subtle text-primary ms-2">Primary</span>
                      }
                    </div>
                    <small class="text-muted">{{ identity.email }}</small>
                  </div>
                  @if (!identity.isPrimary) {
                    <button type="button" class="btn btn-sm btn-outline-danger">
                      Unlink
                    </button>
                  }
                </div>
              }
            </div>
          }
          
          <div class="mt-3">
            <button type="button" class="btn btn-soft-primary btn-sm">
              <i class="bx bx-plus me-1"></i>
              Link Another Account
            </button>
          </div>
        </div>
      </div>

      <!-- Active Sessions Section -->
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h6 class="mb-0">
            <i class="bx bx-devices me-2"></i>
            Active Sessions
          </h6>
          @if (activeSessions().length > 1) {
            <button type="button" class="btn btn-sm btn-outline-danger">
              Sign Out All Other Sessions
            </button>
          }
        </div>
        <div class="card-body">
          @if (activeSessions().length === 0) {
            <p class="text-muted mb-0">No active sessions found.</p>
          } @else {
            <div class="table-responsive">
              <table class="table table-sm mb-0">
                <tbody>
                  @for (session of activeSessions(); track session.id) {
                    <tr>
                      <td>
                        <div class="d-flex align-items-center">
                          <i class="bx bx-desktop me-2 text-muted"></i>
                          <div>
                            <strong>{{ session.device }}</strong>
                            @if (session.isCurrent) {
                              <span class="badge bg-success-subtle text-success ms-2">Current</span>
                            }
                            <br>
                            <small class="text-muted">{{ session.browser }} · {{ session.location }}</small>
                          </div>
                        </div>
                      </td>
                      <td class="text-end text-muted small">
                        {{ formatLastActive(session.lastActive) }}
                      </td>
                      <td class="text-end" style="width: 100px;">
                        @if (!session.isCurrent) {
                          <button type="button" class="btn btn-sm btn-outline-danger">
                            Sign Out
                          </button>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .security-profile {
      padding: 1.5rem;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .identity-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: var(--vz-light);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class SecurityProfileComponent implements OnInit {
  private accountService = inject(AccountService);
  private oidcService = inject(OidcService);
  
  lockedFields = signal<string[]>([]);
  mfaEnabled = signal(false);
  linkedIdentities = signal<LinkedIdentity[]>([]);
  activeSessions = signal<ActiveSession[]>([]);
  identityProvider = signal('');
  
  passwordForm = {
    current: '',
    new: '',
    confirm: ''
  };
  
  ngOnInit(): void {
    this.loadSecurityData();
  }
  
  private loadSecurityData(): void {
    const config = this.accountService.getCurrentConfig();
    // TODO: Add profile.lockedFields to AccountConfig interface
    this.lockedFields.set((config as any)?.profile?.lockedFields || []);
    
    // Detect identity provider from OIDC
    const user = this.oidcService.currentUser();
    const idp = user?.provider || '';
    
    if (idp) {
      this.identityProvider.set(this.getIdpName(idp));
    }
    
    // Mock data for linked identities
    this.linkedIdentities.set([
      {
        provider: 'google',
        providerName: 'Google',
        icon: 'bxl-google',
        email: user?.email || 'user@example.com',
        connectedAt: new Date(),
        isPrimary: true
      }
    ]);
    
    // Mock data for active sessions
    this.activeSessions.set([
      {
        id: '1',
        device: 'Windows PC',
        browser: 'Chrome 120',
        location: 'Auckland, NZ',
        lastActive: new Date(),
        isCurrent: true
      },
      {
        id: '2',
        device: 'iPhone 15',
        browser: 'Safari Mobile',
        location: 'Auckland, NZ',
        lastActive: new Date(Date.now() - 86400000),
        isCurrent: false
      }
    ]);
  }
  
  private getIdpName(idp: string): string {
    const names: Record<string, string> = {
      'google': 'Google',
      'microsoft': 'Microsoft',
      'github': 'GitHub',
      'azure-ad': 'Azure AD',
      'okta': 'Okta',
      'auth0': 'Auth0'
    };
    return names[idp.toLowerCase()] || idp;
  }
  
  isFederatedIdentity(): boolean {
    return !!this.identityProvider();
  }
  
  isFieldLocked(fieldName: string): boolean {
    return this.lockedFields().includes(fieldName);
  }
  
  idpPasswordUrl(): string {
    // Return appropriate URL based on IdP
    const idp = this.identityProvider().toLowerCase();
    const urls: Record<string, string> = {
      'google': 'https://myaccount.google.com/security',
      'microsoft': 'https://account.microsoft.com/security',
      'github': 'https://github.com/settings/security'
    };
    return urls[idp] || '#';
  }
  
  idpMfaUrl(): string {
    const idp = this.identityProvider().toLowerCase();
    const urls: Record<string, string> = {
      'google': 'https://myaccount.google.com/signinoptions/two-step-verification',
      'microsoft': 'https://account.microsoft.com/security',
      'github': 'https://github.com/settings/security'
    };
    return urls[idp] || '#';
  }
  
  isPasswordFormValid(): boolean {
    return (
      this.passwordForm.current.length > 0 &&
      this.passwordForm.new.length >= 8 &&
      this.passwordForm.new === this.passwordForm.confirm
    );
  }
  
  changePassword(): void {
    if (!this.isPasswordFormValid()) return;
    console.log('[SecurityProfile] Change password - not yet implemented');
  }
  
  setupMfa(): void {
    console.log('[SecurityProfile] Setup MFA - not yet implemented');
  }
  
  formatLastActive(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  }
}
