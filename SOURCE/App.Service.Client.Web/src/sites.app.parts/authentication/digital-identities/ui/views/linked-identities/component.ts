import { Component, OnInit } from '@angular/core';

import { DigitalIdentityService } from '../../../services/digital-identity.service';
import { IDENTITY_PROVIDERS } from '../../../models/digital-identity.dto';

/**
 * Linked Identities Component
 * 
 * View and manage linked identity providers (SSO accounts).
 */
@Component({
    selector: 'app-linked-identities',
    imports: [],
    template: `
    <div class="linked-identities-page">
      <div class="page-header mb-4">
        <h2>
          <i class="ri-shield-user-line me-2 text-primary"></i>
          Linked Identities
        </h2>
        <p class="text-muted">Manage your connected sign-in methods.</p>
      </div>
      
      <!-- Linked Accounts -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="card-title mb-0">Connected Accounts</h5>
        </div>
        <div class="card-body">
          @if (identityService.loading()) {
            <div class="text-center py-4">
              <div class="spinner-border text-primary" role="status"></div>
            </div>
          } @else if (identityService.identities().length === 0) {
            <p class="text-muted mb-0">No identity providers linked yet.</p>
          } @else {
            <div class="list-group">
              @for (identity of identityService.identities(); track identity.id) {
                <div class="list-group-item d-flex align-items-center">
                  <i [class]="identity.providerIcon + ' me-3 fs-4'"></i>
                  <div class="flex-grow-1">
                    <h6 class="mb-0">{{ identity.providerName }}</h6>
                    <small class="text-muted">
                      {{ identity.externalEmail || identity.externalUserId }}
                      <span class="mx-1">•</span>
                      {{ identity.lastUsedLabel }}
                    </small>
                  </div>
                  @if (identity.isPrimary) {
                    <span class="badge bg-primary me-2">Primary</span>
                  }
                  <button class="btn btn-outline-danger btn-sm" 
                          (click)="unlinkIdentity(identity.id)"
                          [disabled]="identity.isPrimary">
                    <i class="ri-link-unlink-m"></i>
                  </button>
                </div>
              }
            </div>
          }
        </div>
      </div>
      
      <!-- Available Providers -->
      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0">Add New Connection</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            @for (provider of availableProviders; track provider.id) {
              <div class="col-md-6 col-lg-4">
                <button class="btn btn-outline-secondary w-100 d-flex align-items-center"
                        (click)="linkProvider(provider.id)">
                  <i [class]="provider.icon + ' me-2 fs-5'"></i>
                  Connect {{ provider.name }}
                </button>
              </div>
            }
          </div>
          @if (availableProviders.length === 0) {
            <p class="text-muted mb-0">All available providers are already connected.</p>
          }
        </div>
      </div>
    </div>
  `,
    styles: [`
    .linked-identities-page { padding: 1.5rem; }
  `]
})
export class LinkedIdentitiesComponent implements OnInit {
  
  availableProviders = IDENTITY_PROVIDERS.filter(p => p.enabled);
  
  constructor(public identityService: DigitalIdentityService) {}
  
  ngOnInit(): void {
    this.identityService.loadIdentities();
  }
  
  linkProvider(providerId: string): void {
    // In production, this would initiate OAuth flow
    console.log('Initiating OAuth flow for:', providerId);
    alert(`OAuth flow for ${providerId} would start here. This requires backend integration.`);
  }
  
  unlinkIdentity(id: string): void {
    if (confirm('Are you sure you want to unlink this identity?')) {
      this.identityService.unlinkIdentity(id).subscribe();
    }
  }
}
