/**
 * Authentication Integration Hub
 * 
 * Overview of all authentication integrations available.
 * 
 * Route: /dev/integrations/auth
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface AuthProvider {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  protocol: string;
  status: 'ready' | 'configured' | 'docs-only';
  description: string;
  route: string;
}

@Component({
  selector: 'app-auth-integration-hub',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid" style="max-width: 1200px; padding: 1.5rem;">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a routerLink="/dev">Developer</a></li>
          <li class="breadcrumb-item"><a routerLink="/dev/integrations">Integrations</a></li>
          <li class="breadcrumb-item active">Authentication</li>
        </ol>
      </nav>

      <!-- Header -->
      <div class="d-flex align-items-center gap-3 mb-4">
        <div class="avatar-sm">
          <div class="avatar-title bg-success-subtle text-success rounded">
            <i class="ri-shield-keyhole-line fs-20"></i>
          </div>
        </div>
        <div>
          <h4 class="mb-1">Authentication Integration</h4>
          <p class="text-muted mb-0">OIDC, OAuth2, and local authentication setup guides</p>
        </div>
      </div>

      <!-- Architecture Overview -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0"><i class="ri-git-branch-line me-2"></i>Architecture Overview</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <h6 class="text-primary">Provider-First Design</h6>
              <p class="text-muted small mb-3">
                Users choose their identity provider first, then authenticate.
                This supports zero-trust architectures and multi-provider scenarios.
              </p>
              <pre class="bg-light p-3 rounded small"><code>┌─────────────────────────────────┐
│  Provider Selection Screen      │
│  ┌─────────────────────────┐    │
│  │ Continue with Microsoft │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ Continue with Google    │    │
│  └─────────────────────────┘    │
│  ────────── or ──────────       │
│  ┌─────────────────────────┐    │
│  │ Continue with Email     │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘</code></pre>
            </div>
            <div class="col-md-6">
              <h6 class="text-primary">Data Model</h6>
              <pre class="bg-light p-3 rounded small"><code>Person (human details)
└── User (system identity)
    ├── DigitalIdentity (microsoft)
    ├── DigitalIdentity (google)
    └── DigitalIdentity (email)</code></pre>
              <p class="text-muted small mt-3">
                A single User can have multiple DigitalIdentities, 
                allowing login via any linked provider.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Providers Grid -->
      <div class="row">
        @for (provider of providers; track provider.id) {
          <div class="col-md-6 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="avatar-sm me-3">
                    <div class="avatar-title rounded" [style.background]="provider.iconColor">
                      <i [class]="provider.icon + ' fs-20 text-white'"></i>
                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <h5 class="mb-0">{{ provider.name }}</h5>
                    <span class="badge" 
                          [ngClass]="{
                            'bg-soft-success text-success': provider.status === 'ready',
                            'bg-soft-warning text-warning': provider.status === 'configured',
                            'bg-soft-secondary text-secondary': provider.status === 'docs-only'
                          }">
                      {{ provider.protocol }} • 
                      {{ provider.status === 'ready' ? 'Ready' : 
                         provider.status === 'configured' ? 'Needs Config' : 'Docs Only' }}
                    </span>
                  </div>
                </div>
                <p class="text-muted mb-3">{{ provider.description }}</p>
                <a [routerLink]="provider.route" class="btn btn-soft-primary">
                  View Guide <i class="ri-arrow-right-line ms-1"></i>
                </a>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Configuration Location -->
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0"><i class="ri-settings-3-line me-2"></i>Configuration Files</h5>
        </div>
        <div class="card-body">
          <table class="table table-bordered mb-0">
            <thead class="table-light">
              <tr>
                <th>File</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>/assets/config/auth-providers.json</code></td>
                <td>Provider list, enabled/disabled, display order</td>
              </tr>
              <tr>
                <td><code>/environments/environment.ts</code></td>
                <td>OIDC client IDs and configuration</td>
              </tr>
              <tr>
                <td><code>/core.ag/auth/services/</code></td>
                <td>Authentication services (OidcService, FakeAuthRepository)</td>
              </tr>
              <tr>
                <td><code>/core/auth/models/</code></td>
                <td>Configuration models and types</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AuthIntegrationHubComponent {
  
  providers: AuthProvider[] = [
    {
      id: 'microsoft',
      name: 'Microsoft Entra ID',
      icon: 'ri-microsoft-fill',
      iconColor: '#00a4ef',
      protocol: 'OIDC',
      status: 'configured',
      description: 'Azure AD / Microsoft Entra ID for enterprise and personal Microsoft accounts.',
      route: '/dev/integrations/auth/microsoft'
    },
    {
      id: 'google',
      name: 'Google Identity',
      icon: 'ri-google-fill',
      iconColor: '#ea4335',
      protocol: 'OIDC',
      status: 'configured',
      description: 'Google Sign-In for consumer and Google Workspace accounts.',
      route: '/dev/integrations/auth/google'
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: 'ri-github-fill',
      iconColor: '#24292e',
      protocol: 'OAuth2',
      status: 'docs-only',
      description: 'GitHub OAuth for developer-focused applications.',
      route: '/dev/integrations/auth/github'
    },
    {
      id: 'local',
      name: 'Email / Password',
      icon: 'ri-mail-fill',
      iconColor: '#6c757d',
      protocol: 'Local',
      status: 'ready',
      description: 'Traditional email and password authentication with secure hashing.',
      route: '/dev/integrations/auth/local'
    }
  ];
}
