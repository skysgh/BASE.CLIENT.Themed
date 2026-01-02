/**
 * Local Auth Documentation
 * 
 * Documentation for email/password authentication (demo implementation).
 * 
 * Route: /dev/integrations/auth/local
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-local-auth-doc',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid" style="max-width: 1000px; padding: 1.5rem;">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a routerLink="/dev">Developer</a></li>
          <li class="breadcrumb-item"><a routerLink="/dev/integrations/auth">Auth Integration</a></li>
          <li class="breadcrumb-item active">Local Auth</li>
        </ol>
      </nav>

      <!-- Header -->
      <div class="d-flex align-items-center gap-3 mb-4">
        <div class="avatar-md">
          <div class="avatar-title rounded" style="background: #6c757d;">
            <i class="ri-mail-fill fs-24 text-white"></i>
          </div>
        </div>
        <div>
          <h3 class="mb-1">Email / Password Authentication</h3>
          <span class="badge bg-success">Ready (Demo)</span>
          <span class="badge bg-info ms-1">LocalStorage</span>
        </div>
      </div>

      <!-- Warning -->
      <div class="alert alert-warning mb-4">
        <i class="ri-error-warning-line me-2"></i>
        <strong>Demo Implementation:</strong> This uses localStorage for demonstration purposes.
        Production systems must use a secure backend with proper password hashing (bcrypt/argon2).
      </div>

      <!-- Architecture -->
      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0"><i class="ri-building-line me-2"></i>Architecture</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <h6>Demo Mode (Current)</h6>
              <pre class="bg-light p-3 rounded small"><code>┌──────────────┐
│   Browser    │
├──────────────┤
│ Login Form   │
│      ↓       │
│ FakeAuthRepo │
│      ↓       │
│ localStorage │
└──────────────┘</code></pre>
            </div>
            <div class="col-md-6">
              <h6>Production Mode (Future)</h6>
              <pre class="bg-light p-3 rounded small"><code>┌──────────────┐    ┌──────────────┐
│   Browser    │    │   Backend    │
├──────────────┤    ├──────────────┤
│ Login Form   │───→│ Auth API     │
│              │←───│ JWT Token    │
│ Token Store  │    │ bcrypt/DB    │
└──────────────┘    └──────────────┘</code></pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Practices -->
      <div class="card mb-4 border-success">
        <div class="card-header bg-success text-white">
          <h5 class="mb-0"><i class="ri-shield-check-line me-2"></i>Security Practices (Even in Demo)</h5>
        </div>
        <div class="card-body">
          <p>The FakeAuthRepository implements security best practices to establish good patterns:</p>
          
          <table class="table table-bordered">
            <thead class="table-light">
              <tr>
                <th>Practice</th>
                <th>Implementation</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Password Hashing</strong></td>
                <td>SHA-256</td>
                <td>Never store plaintext passwords (production: use bcrypt)</td>
              </tr>
              <tr>
                <td><strong>Per-User Salt</strong></td>
                <td>Derived from userId + email</td>
                <td>Prevents rainbow table attacks</td>
              </tr>
              <tr>
                <td><strong>Application Pepper</strong></td>
                <td>Hardcoded constant</td>
                <td>Extra layer (production: use env variable)</td>
              </tr>
              <tr>
                <td><strong>Account Lockout</strong></td>
                <td>5 attempts, 15 min lockout</td>
                <td>Prevents brute force attacks</td>
              </tr>
              <tr>
                <td><strong>Reset Token Expiry</strong></td>
                <td>1 hour</td>
                <td>Limits window of vulnerability</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Code Location -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0"><i class="ri-folder-line me-2"></i>Code Location</h5>
        </div>
        <div class="card-body">
          <table class="table table-bordered mb-0">
            <tbody>
              <tr>
                <td><code>core.ag/auth/services/fake-auth-repository.service.ts</code></td>
                <td>Demo auth repository with localStorage</td>
              </tr>
              <tr>
                <td><code>core.ag/auth/ui/widgets/email-login-form.component.ts</code></td>
                <td>Login form component</td>
              </tr>
              <tr>
                <td><code>core.ag/auth/ui/widgets/email-signup-form.component.ts</code></td>
                <td>Registration form component</td>
              </tr>
              <tr>
                <td><code>core.ag/auth/ui/widgets/forgot-password-form.component.ts</code></td>
                <td>Password reset request form</td>
              </tr>
              <tr>
                <td><code>core.ag/auth/ui/widgets/reset-password-form.component.ts</code></td>
                <td>New password entry form</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Data Model -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0"><i class="ri-database-2-line me-2"></i>Data Model</h5>
        </div>
        <div class="card-body">
          <pre class="bg-dark text-light p-3 rounded"><code>// When a user registers via email:

Person {{ '{' }}
  id: "uuid",
  firstName: "John",
  lastName: "Doe",
  email: "john&#64;example.com"
{{ '}' }}

User {{ '{' }}
  id: "uuid",
  personId: "→ Person.id",
  enabled: true,
  createdAt: "ISO date"
{{ '}' }}

DigitalIdentity {{ '{' }}
  id: "uuid",
  userId: "→ User.id",
  providerId: "email",               // ← Local auth
  externalUserId: "john&#64;example.com",
  isPrimary: true
{{ '}' }}

EmailCredential {{ '{' }}
  userId: "→ User.id",
  email: "john&#64;example.com",
  passwordHash: "sha256(...)",
  salt: "derived-from-user",
  failedAttempts: 0,
  lockedUntil: null
{{ '}' }}</code></pre>
        </div>
      </div>

      <!-- Demo Users -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0"><i class="ri-user-line me-2"></i>Demo Users</h5>
        </div>
        <div class="card-body">
          <p>The following users are seeded automatically on first load:</p>
          <table class="table table-bordered">
            <thead class="table-light">
              <tr>
                <th>Email</th>
                <th>Password</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>admin&#64;themesbrand.com</code></td>
                <td><code>123456</code></td>
                <td>Admin User</td>
              </tr>
              <tr>
                <td><code>demo&#64;example.com</code></td>
                <td><code>demo123</code></td>
                <td>Demo Account</td>
              </tr>
            </tbody>
          </table>
          <p class="text-muted small mb-0">
            Data is stored in localStorage. Clear browser data to reset.
          </p>
        </div>
      </div>

      <!-- Swapping to Production -->
      <div class="card mb-4">
        <div class="card-header bg-info text-white">
          <h5 class="mb-0"><i class="ri-rocket-line me-2"></i>Swapping to Production</h5>
        </div>
        <div class="card-body">
          <p>To move to a real backend:</p>
          <ol>
            <li>Create an <code>AuthApiService</code> that implements the same interface as <code>FakeAuthRepository</code></li>
            <li>Point it to your backend endpoints:
              <ul>
                <li><code>POST /api/auth/login</code></li>
                <li><code>POST /api/auth/register</code></li>
                <li><code>POST /api/auth/forgot-password</code></li>
                <li><code>POST /api/auth/reset-password</code></li>
              </ul>
            </li>
            <li>Update the dependency injection in the module to use the new service</li>
            <li>Backend should use proper password hashing (bcrypt with cost 12+)</li>
          </ol>
        </div>
      </div>

      <!-- Configuration -->
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0"><i class="ri-settings-3-line me-2"></i>Configuration</h5>
        </div>
        <div class="card-body">
          <p>Local auth is controlled via <code>/assets/config/auth-providers.json</code>:</p>
          <pre class="bg-dark text-light p-3 rounded"><code>{{ '{' }}
  "providers": [
    {{ '{' }}
      "id": "email",
      "name": "Email",
      "displayName": "Continue with Email",
      "icon": "ri-mail-fill",
      "enabled": true,        // Show email option
      "protocol": "local",
      "order": 100            // Show last (after OIDC providers)
    {{ '}' }}
  ],
  "settings": {{ '{' }}
    "allowLocalLogin": true,  // Master switch for email/password
    "allowSignup": true,      // Allow new registrations
    "maxLoginAttempts": 5,    // Before lockout
    "lockoutMinutes": 15      // Lockout duration
  {{ '}' }}
{{ '}' }}</code></pre>
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
export class LocalAuthDocComponent { }
