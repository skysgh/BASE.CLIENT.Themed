/**
 * Google OIDC Documentation
 * 
 * Setup guide for Google Identity Platform authentication.
 * 
 * Route: /dev/integrations/auth/google
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-google-oidc-doc',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid" style="max-width: 1000px; padding: 1.5rem;">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a routerLink="/dev">Developer</a></li>
          <li class="breadcrumb-item"><a routerLink="/dev/integrations/auth">Auth Integration</a></li>
          <li class="breadcrumb-item active">Google</li>
        </ol>
      </nav>

      <!-- Header -->
      <div class="d-flex align-items-center gap-3 mb-4">
        <div class="avatar-md">
          <div class="avatar-title rounded" style="background: #ea4335;">
            <i class="ri-google-fill fs-24 text-white"></i>
          </div>
        </div>
        <div>
          <h3 class="mb-1">Google Identity Platform</h3>
          <span class="badge bg-success">OIDC</span>
          <span class="badge bg-secondary ms-1">Consumer + Workspace</span>
        </div>
      </div>

      <!-- Prerequisites -->
      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0"><i class="ri-checkbox-circle-line me-2"></i>Prerequisites</h5>
        </div>
        <div class="card-body">
          <ul class="mb-0">
            <li>Google Cloud account (<a href="https://console.cloud.google.com" target="_blank">console.cloud.google.com</a>)</li>
            <li>A project in Google Cloud Console</li>
          </ul>
        </div>
      </div>

      <!-- Step 1 -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0"><span class="badge bg-primary me-2">1</span>Create OAuth Credentials</h5>
        </div>
        <div class="card-body">
          <ol>
            <li class="mb-2">Go to <strong>Google Cloud Console</strong> → <strong>APIs & Services</strong> → <strong>Credentials</strong></li>
            <li class="mb-2">Click <strong>Create Credentials</strong> → <strong>OAuth client ID</strong></li>
            <li class="mb-2">If prompted, configure the OAuth consent screen first:
              <ul>
                <li>Choose <strong>External</strong> (for public apps) or <strong>Internal</strong> (Workspace only)</li>
                <li>Fill in app name, support email</li>
                <li>Add scopes: <code>email</code>, <code>profile</code>, <code>openid</code></li>
              </ul>
            </li>
            <li class="mb-2">
              For Application type, select <strong>Web application</strong>
            </li>
            <li class="mb-2">
              Add Authorized redirect URIs:
              <pre class="bg-light p-2 rounded mt-2"><code>https://your-domain.com/auth/callback</code></pre>
              For development:
              <pre class="bg-light p-2 rounded mt-2"><code>http://localhost:4200/auth/callback</code></pre>
            </li>
            <li>Click <strong>Create</strong></li>
          </ol>
        </div>
      </div>

      <!-- Step 2 -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0"><span class="badge bg-primary me-2">2</span>Copy Client ID</h5>
        </div>
        <div class="card-body">
          <p>After creation, you'll see your credentials. Copy the <strong>Client ID</strong>.</p>
          <div class="alert alert-warning">
            <strong>Security:</strong> Never commit your Client Secret to source control.
            For SPA apps, we use the implicit flow which doesn't require the secret.
          </div>
        </div>
      </div>

      <!-- Step 3 -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0"><span class="badge bg-primary me-2">3</span>Update Environment Configuration</h5>
        </div>
        <div class="card-body">
          <p>Edit <code>/environments/environment.ts</code>:</p>
          <pre class="bg-dark text-light p-3 rounded"><code>export const environment = {{ '{' }}
  // ...existing config...
  
  oidcConfig: {{ '{' }}
    providers: [
      {{ '{' }}
        provider: 'google',
        displayName: 'Google',
        icon: 'ri-google-fill',
        enabled: true,
        clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
        authority: 'https://accounts.google.com',
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

      <!-- Step 4 -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0"><span class="badge bg-primary me-2">4</span>Enable in Provider Config</h5>
        </div>
        <div class="card-body">
          <p>Edit <code>/assets/config/auth-providers.json</code> and ensure Google is enabled:</p>
          <pre class="bg-dark text-light p-3 rounded"><code>{{ '{' }}
  "providers": [
    {{ '{' }}
      "id": "google",
      "name": "Google",
      "displayName": "Continue with Google",
      "icon": "ri-google-fill",
      "enabled": true,  // ← Set to true
      "protocol": "oidc",
      "order": 2
    {{ '}' }}
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
            <li>Click "Continue with Google"</li>
            <li>Select a Google account</li>
            <li>After authentication, you'll be redirected back</li>
          </ol>
        </div>
      </div>

      <!-- Production Notes -->
      <div class="card">
        <div class="card-header bg-info text-white">
          <h5 class="mb-0"><i class="ri-rocket-line me-2"></i>Production Checklist</h5>
        </div>
        <div class="card-body">
          <ul>
            <li>Verify your app in Google Cloud Console (required for production)</li>
            <li>Add production redirect URIs</li>
            <li>Configure proper OAuth consent screen branding</li>
            <li>Request verification if using sensitive scopes</li>
          </ul>
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
export class GoogleOidcDocComponent { }
