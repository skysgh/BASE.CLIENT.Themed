/**
 * Microsoft OIDC Documentation
 * 
 * Setup guide for Microsoft Entra ID (Azure AD) authentication.
 * 
 * Route: /dev/integrations/auth/microsoft
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-microsoft-oidc-doc',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid" style="max-width: 1000px; padding: 1.5rem;">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a routerLink="/dev">Developer</a></li>
          <li class="breadcrumb-item"><a routerLink="/dev/integrations/auth">Auth Integration</a></li>
          <li class="breadcrumb-item active">Microsoft</li>
        </ol>
      </nav>

      <!-- Header -->
      <div class="d-flex align-items-center gap-3 mb-4">
        <div class="avatar-md">
          <div class="avatar-title rounded" style="background: #00a4ef;">
            <i class="ri-microsoft-fill fs-24 text-white"></i>
          </div>
        </div>
        <div>
          <h3 class="mb-1">Microsoft Entra ID (Azure AD)</h3>
          <span class="badge bg-success">OIDC</span>
          <span class="badge bg-secondary ms-1">Enterprise + Personal</span>
        </div>
      </div>

      <!-- Prerequisites -->
      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0"><i class="ri-checkbox-circle-line me-2"></i>Prerequisites</h5>
        </div>
        <div class="card-body">
          <ul class="mb-0">
            <li>Azure subscription (free tier works)</li>
            <li>Access to Azure Portal (<a href="https://portal.azure.com" target="_blank">portal.azure.com</a>)</li>
            <li>Permission to register applications in Entra ID</li>
          </ul>
        </div>
      </div>

      <!-- Step 1 -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0"><span class="badge bg-primary me-2">1</span>Register Application in Azure</h5>
        </div>
        <div class="card-body">
          <ol>
            <li class="mb-2">Go to <strong>Azure Portal</strong> → <strong>Microsoft Entra ID</strong> → <strong>App registrations</strong></li>
            <li class="mb-2">Click <strong>New registration</strong></li>
            <li class="mb-2">
              Fill in the form:
              <ul>
                <li><strong>Name:</strong> Your App Name</li>
                <li><strong>Supported account types:</strong> Choose based on your needs:
                  <ul>
                    <li><em>Single tenant:</em> Your organization only</li>
                    <li><em>Multitenant:</em> Any Azure AD organization</li>
                    <li><em>Personal accounts:</em> Include Microsoft personal accounts</li>
                  </ul>
                </li>
                <li><strong>Redirect URI:</strong> Select "Single-page application (SPA)" and enter:
                  <pre class="bg-light p-2 rounded mt-2"><code>https://your-domain.com/auth/callback</code></pre>
                  For development:
                  <pre class="bg-light p-2 rounded mt-2"><code>http://localhost:4200/auth/callback</code></pre>
                </li>
              </ul>
            </li>
            <li>Click <strong>Register</strong></li>
          </ol>
        </div>
      </div>

      <!-- Step 2 -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0"><span class="badge bg-primary me-2">2</span>Configure Authentication</h5>
        </div>
        <div class="card-body">
          <ol>
            <li class="mb-2">In your new app registration, go to <strong>Authentication</strong></li>
            <li class="mb-2">Under <strong>Single-page application</strong>, verify your redirect URI is listed</li>
            <li class="mb-2">Enable <strong>Access tokens</strong> and <strong>ID tokens</strong> under "Implicit grant"</li>
            <li class="mb-2">Click <strong>Save</strong></li>
          </ol>
          <div class="alert alert-info mt-3">
            <strong>Note:</strong> For SPA applications, Microsoft recommends the Authorization Code flow with PKCE,
            which is what our OidcService uses by default.
          </div>
        </div>
      </div>

      <!-- Step 3 -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0"><span class="badge bg-primary me-2">3</span>Copy Configuration Values</h5>
        </div>
        <div class="card-body">
          <p>From the <strong>Overview</strong> page, copy these values:</p>
          <table class="table table-bordered">
            <thead class="table-light">
              <tr>
                <th>Azure Portal Field</th>
                <th>Config Property</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Application (client) ID</td>
                <td><code>clientId</code></td>
              </tr>
              <tr>
                <td>Directory (tenant) ID</td>
                <td><code>authority</code> (part of URL)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Step 4 -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0"><span class="badge bg-primary me-2">4</span>Update Environment Configuration</h5>
        </div>
        <div class="card-body">
          <p>Edit <code>/environments/environment.ts</code>:</p>
          <pre class="bg-dark text-light p-3 rounded"><code>export const environment = {{ '{' }}
  // ...existing config...
  
  oidcConfig: {{ '{' }}
    providers: [
      {{ '{' }}
        provider: 'microsoft',
        displayName: 'Microsoft',
        icon: 'ri-microsoft-fill',
        enabled: true,
        clientId: 'YOUR_CLIENT_ID_HERE',
        authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
        redirectUri: 'http://localhost:4200/auth/callback',
        scopes: ['openid', 'profile', 'email']
      {{ '}' }}
    ],
    allowLocalLogin: true,
    postLoginRedirect: '/dashboards/main',
    postLogoutRedirect: '/auth/signin'
  {{ '}' }}
{{ '}' }};</code></pre>
        </div>
      </div>

      <!-- Step 5 -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0"><span class="badge bg-primary me-2">5</span>Enable in Provider Config</h5>
        </div>
        <div class="card-body">
          <p>Edit <code>/assets/config/auth-providers.json</code> and ensure Microsoft is enabled:</p>
          <pre class="bg-dark text-light p-3 rounded"><code>{{ '{' }}
  "providers": [
    {{ '{' }}
      "id": "microsoft",
      "name": "Microsoft",
      "displayName": "Continue with Microsoft",
      "icon": "ri-microsoft-fill",
      "enabled": true,  // ← Set to true
      "protocol": "oidc",
      "order": 1
    {{ '}' }}
    // ...other providers...
  ]
{{ '}' }}</code></pre>
        </div>
      </div>

      <!-- Testing -->
      <div class="card mb-4 border-success">
        <div class="card-header bg-success text-white">
          <h5 class="mb-0"><i class="ri-test-tube-line me-2"></i>Testing</h5>
        </div>
        <div class="card-body">
          <ol>
            <li>Start the development server: <code>npm start</code></li>
            <li>Navigate to <code>/auth/signin</code></li>
            <li>Click "Continue with Microsoft"</li>
            <li>You should be redirected to Microsoft's login page</li>
            <li>After authentication, you'll be redirected back to your app</li>
          </ol>
        </div>
      </div>

      <!-- Troubleshooting -->
      <div class="card">
        <div class="card-header bg-warning text-dark">
          <h5 class="mb-0"><i class="ri-error-warning-line me-2"></i>Common Issues</h5>
        </div>
        <div class="card-body">
          <div class="accordion" id="troubleshootingAccordion">
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#issue1">
                  AADSTS50011: Reply URL does not match
                </button>
              </h2>
              <div id="issue1" class="accordion-collapse collapse" data-bs-parent="#troubleshootingAccordion">
                <div class="accordion-body">
                  The redirect URI in your code doesn't match what's registered in Azure.
                  Check that both use the same protocol (http vs https) and path.
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#issue2">
                  AADSTS700016: Application not found
                </button>
              </h2>
              <div id="issue2" class="accordion-collapse collapse" data-bs-parent="#troubleshootingAccordion">
                <div class="accordion-body">
                  Verify the clientId is correct and the app registration exists in the specified tenant.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Back link -->
      <div class="mt-4">
        <a routerLink="/dev/integrations/auth" class="btn btn-outline-primary">
          <i class="ri-arrow-left-line me-1"></i> Back to Auth Overview
        </a>
      </div>
    </div>
  `
})
export class MicrosoftOidcDocComponent { }
