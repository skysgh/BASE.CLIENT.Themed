/**
 * Auth Provider List Component
 * 
 * Displays available identity providers as large, prominent buttons.
 * Provider-first design: Users choose HOW they want to authenticate first.
 * 
 * LOCATION: core.ag (Angular-specific component)
 * 
 * Configuration loaded from /assets/config/auth-providers.json
 */
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { 
  AuthProvidersConfiguration, 
  AuthProviderConfig,
  DEFAULT_AUTH_CONFIG 
} from '../../../../core/auth/models/auth-providers-config.model';

/**
 * Provider display info (emitted on selection)
 */
export interface AuthProviderDisplay {
  id: string;
  name: string;
  icon: string;
  buttonClass: string;
  type: 'oidc' | 'oauth2' | 'local';
  protocol: string;
}

@Component({
    selector: 'app-auth-provider-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="auth-provider-list">
      <!-- External Providers (Microsoft, Google, GitHub, etc.) -->
      @for (provider of externalProviders; track provider.id) {
        <div class="mb-3">
          <button
            type="button"
            class="btn w-100 d-flex align-items-center justify-content-center gap-2 provider-btn"
            [ngClass]="provider.buttonClass"
            [style.--provider-color]="provider.iconColor"
            (click)="selectProvider(provider)">
            <i [class]="provider.icon + ' fs-18'"></i>
            <span>{{ provider.displayName }}</span>
          </button>
        </div>
      }
    
      <!-- Divider (if both external and local are available) -->
      @if (externalProviders.length > 0 && emailProvider) {
        <div class="divider my-4">
          <span class="divider-text text-muted">{{ orText }}</span>
        </div>
      }
    
      <!-- Email/Password Option -->
      @if (emailProvider) {
        <div class="mb-3">
          <button
            type="button"
            class="btn w-100 d-flex align-items-center justify-content-center gap-2 provider-btn"
            [ngClass]="emailProvider.buttonClass"
            (click)="selectEmailProvider()">
            <i [class]="emailProvider.icon + ' fs-18'"></i>
            <span>{{ emailProvider.displayName }}</span>
          </button>
        </div>
      }

      <!-- Loading state -->
      @if (loading) {
        <div class="text-center py-3">
          <div class="spinner-border spinner-border-sm text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      }
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

    /* GitHub button */
    .btn-github {
      background-color: #24292e;
      border-color: #24292e;
      color: #ffffff;
    }
    .btn-github:hover {
      background-color: #1b1f23;
      border-color: #1b1f23;
      color: #ffffff;
    }

    /* Apple button */
    .btn-apple {
      background-color: #000000;
      border-color: #000000;
      color: #ffffff;
    }
    .btn-apple:hover {
      background-color: #1a1a1a;
      border-color: #1a1a1a;
      color: #ffffff;
    }

    /* X (Twitter) button */
    .btn-twitter-x {
      background-color: #000000;
      border-color: #000000;
      color: #ffffff;
    }
    .btn-twitter-x:hover {
      background-color: #1a1a1a;
      border-color: #1a1a1a;
      color: #ffffff;
    }

    /* LinkedIn button */
    .btn-linkedin {
      background-color: #0077b5;
      border-color: #0077b5;
      color: #ffffff;
    }
    .btn-linkedin:hover {
      background-color: #006097;
      border-color: #006097;
      color: #ffffff;
    }

    /* Facebook button */
    .btn-facebook {
      background-color: #1877f2;
      border-color: #1877f2;
      color: #ffffff;
    }
    .btn-facebook:hover {
      background-color: #166fe5;
      border-color: #166fe5;
      color: #ffffff;
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
   * Override the "or" divider text
   */
  @Input() orText = 'or';

  /**
   * Emitted when a provider is selected
   */
  @Output() providerSelected = new EventEmitter<AuthProviderDisplay>();

  /**
   * Configuration loaded from JSON
   */
  config: AuthProvidersConfiguration = DEFAULT_AUTH_CONFIG;

  /**
   * External providers (OIDC, OAuth2)
   */
  externalProviders: (AuthProviderConfig & { iconColor: string })[] = [];

  /**
   * Email provider (local auth)
   */
  emailProvider: AuthProviderConfig | null = null;

  /**
   * Loading state
   */
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadConfiguration();
  }

  /**
   * Load configuration from JSON file
   */
  private loadConfiguration(): void {
    this.http.get<AuthProvidersConfiguration>('/assets/config/auth-providers.json')
      .subscribe({
        next: (config) => {
          this.config = config;
          this.processProviders();
          this.loading = false;
        },
        error: (err) => {
          console.warn('[AuthProviderList] Failed to load config, using defaults:', err);
          this.config = DEFAULT_AUTH_CONFIG;
          this.processProviders();
          this.loading = false;
        }
      });
  }

  /**
   * Process providers from configuration
   */
  private processProviders(): void {
    const enabledProviders = this.config.providers
      .filter(p => p.enabled)
      .sort((a, b) => a.order - b.order);

    // Separate external providers from email
    this.externalProviders = enabledProviders
      .filter(p => p.protocol !== 'local')
      .map(p => ({ ...p, iconColor: p.iconColor }));

    // Email provider
    const email = enabledProviders.find(p => p.protocol === 'local');
    this.emailProvider = this.config.settings.allowLocalLogin ? email || null : null;

    // Update orText from branding if available
    if (this.config.branding?.orDividerText) {
      this.orText = this.config.branding.orDividerText;
    }
  }

  /**
   * Handle provider selection (external)
   */
  selectProvider(provider: AuthProviderConfig): void {
    const display: AuthProviderDisplay = {
      id: provider.id,
      name: provider.name,
      icon: provider.icon,
      buttonClass: provider.buttonClass,
      type: provider.protocol === 'oidc' ? 'oidc' : 'oauth2',
      protocol: provider.protocol
    };
    this.providerSelected.emit(display);
  }

  /**
   * Handle email provider selection
   */
  selectEmailProvider(): void {
    if (!this.emailProvider) return;
    
    const display: AuthProviderDisplay = {
      id: 'email',
      name: 'Email',
      icon: this.emailProvider.icon,
      buttonClass: this.emailProvider.buttonClass,
      type: 'local',
      protocol: 'local'
    };
    this.providerSelected.emit(display);
  }
}
