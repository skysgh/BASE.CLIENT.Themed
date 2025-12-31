/**
 * Auth Provider List Component
 * 
 * Displays available identity providers as large, prominent buttons.
 * Provider-first design: Users choose HOW they want to authenticate first.
 * 
 * LOCATION: core.ag (Angular-specific component)
 */
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OidcService } from '../services/oidc.service';
import { environment } from '../../../environments/environment';

/**
 * Provider display info
 */
export interface AuthProviderDisplay {
  id: string;
  name: string;
  icon: string;
  buttonClass: string;
  type: 'oidc' | 'local';
}

@Component({
  selector: 'app-auth-provider-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-provider-list">
      <!-- OIDC Providers (Microsoft, Google, etc.) -->
      <div *ngFor="let provider of oidcProviders" class="mb-3">
        <button 
          type="button"
          class="btn w-100 d-flex align-items-center justify-content-center gap-2 provider-btn"
          [ngClass]="provider.buttonClass"
          (click)="selectProvider(provider)">
          <i [class]="provider.icon + ' fs-18'"></i>
          <span>{{ continueWithText }} {{ provider.name }}</span>
        </button>
      </div>

      <!-- Divider (if both OIDC and local are available) -->
      <div *ngIf="oidcProviders.length > 0 && showEmailOption" class="divider my-4">
        <span class="divider-text text-muted">{{ orText }}</span>
      </div>

      <!-- Email/Password Option -->
      <div *ngIf="showEmailOption" class="mb-3">
        <button 
          type="button"
          class="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2 provider-btn"
          (click)="selectEmailProvider()">
          <i class="ri-mail-line fs-18"></i>
          <span>{{ continueWithText }} {{ emailText }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .auth-provider-list {
      width: 100%;
    }

    .provider-btn {
      padding: 0.75rem 1rem;
      font-size: 0.95rem;
      font-weight: 500;
      border-radius: 0.375rem;
      transition: all 0.2s ease;
    }

    .provider-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    /* Microsoft button */
    .btn-microsoft {
      background-color: #2f2f2f;
      border-color: #2f2f2f;
      color: #ffffff;
    }
    .btn-microsoft:hover {
      background-color: #1a1a1a;
      border-color: #1a1a1a;
      color: #ffffff;
    }

    /* Google button */
    .btn-google {
      background-color: #ffffff;
      border: 1px solid #dadce0;
      color: #3c4043;
    }
    .btn-google:hover {
      background-color: #f8f9fa;
      border-color: #dadce0;
      box-shadow: 0 1px 3px rgba(60, 64, 67, 0.3);
    }

    /* Divider */
    .divider {
      display: flex;
      align-items: center;
      text-align: center;
    }
    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid var(--vz-border-color);
    }
    .divider-text {
      padding: 0 1rem;
      font-size: 0.875rem;
      text-transform: lowercase;
    }
  `]
})
export class AuthProviderListComponent implements OnInit {
  
  /**
   * Text customization
   */
  @Input() continueWithText = 'Continue with';
  @Input() orText = 'or';
  @Input() emailText = 'Email';

  /**
   * Whether to show the email/password option
   */
  @Input() showEmailOption = true;

  /**
   * Emitted when a provider is selected
   */
  @Output() providerSelected = new EventEmitter<AuthProviderDisplay>();

  /**
   * Available OIDC providers
   */
  oidcProviders: AuthProviderDisplay[] = [];

  constructor(private oidcService: OidcService) {}

  ngOnInit(): void {
    this.loadProviders();
  }

  /**
   * Load enabled providers from configuration
   */
  private loadProviders(): void {
    const config = environment.oidcConfig;
    if (!config) return;

    this.oidcProviders = config.providers
      .filter(p => p.enabled)
      .map(p => ({
        id: p.provider,
        name: p.displayName,
        icon: p.icon,
        buttonClass: this.getButtonClass(p.provider),
        type: 'oidc' as const
      }));

    // Check if local login is allowed
    this.showEmailOption = config.allowLocalLogin !== false;
  }

  /**
   * Get button class for provider
   */
  private getButtonClass(provider: string): string {
    const classes: Record<string, string> = {
      'microsoft': 'btn-microsoft',
      'google': 'btn-google',
      'auth0': 'btn-primary',
      'okta': 'btn-info'
    };
    return classes[provider] || 'btn-secondary';
  }

  /**
   * Handle provider selection
   */
  selectProvider(provider: AuthProviderDisplay): void {
    this.providerSelected.emit(provider);
  }

  /**
   * Handle email provider selection
   */
  selectEmailProvider(): void {
    this.providerSelected.emit({
      id: 'email',
      name: 'Email',
      icon: 'ri-mail-line',
      buttonClass: 'btn-outline-secondary',
      type: 'local'
    });
  }
}
