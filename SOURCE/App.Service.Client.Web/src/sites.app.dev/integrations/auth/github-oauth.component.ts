/**
 * GitHub OAuth Documentation
 * 
 * Setup guide for GitHub OAuth authentication.
 * 
 * Route: /dev/integrations/auth/github
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-github-oauth-doc',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid" style="max-width: 1000px; padding: 1.5rem;">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a routerLink="/dev">Developer</a></li>
          <li class="breadcrumb-item"><a routerLink="/dev/integrations/auth">Auth Integration</a></li>
          <li class="breadcrumb-item active">GitHub</li>
        </ol>
      </nav>

      <!-- Header -->
      <div class="d-flex align-items-center gap-3 mb-4">
        <div class="avatar-md">
          <div class="avatar-title rounded" style="background: #24292e;">
            <i class="ri-github-fill fs-24 text-white"></i>
          </div>
        </div>
        <div>
          <h3 class="mb-1">GitHub OAuth</h3>
          <span class="badge bg-warning text-dark">OAuth2</span>
          <span class="badge bg-secondary ms-1">Developer-focused</span>
        </div>
      </div>

      <!-- Note -->
      <div class="alert alert-warning mb-4">
        <i class="ri-information-line me-2"></i>
        <strong>Note:</strong> GitHub uses OAuth2 (not OIDC). This requires a backend component 
        to exchange the authorization code for tokens. The current implementation is a stub.
      </div>

      <!-- Prerequisites -->
      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0"><i class="ri-checkbox-circle-line me-2"></i>Prerequisites</h5>
        </div>
        <div class="card-body">
          <ul class="mb-0">
            <li>GitHub account</li>
            <li>Backend service to handle OAuth2 code exchange (or use a BFF pattern)</li>
          </ul>
        </div>
      </div>

      <!-- Step 1 -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0"><span class="badge bg-primary me-2">1</span>Create GitHub OAuth App</h5>
        </div>
        <div class="card-body">
          <ol>
            <li class="mb-2">Go to <strong>GitHub Settings</strong> → <strong>Developer settings</strong> → <strong>OAuth Apps</strong></li>
            <li class="mb-2">Click <strong>New OAuth App</strong></li>
            <li class="mb-2">
              Fill in the form:
              <ul>
                <li><strong>Application name:</strong> Your App Name</li>
                <li><strong>Homepage URL:</strong> https://your-domain.com</li>
                <li><strong>Authorization callback URL:</strong>
                  <pre class="bg-light p-2 rounded mt-2"><code>https://your-domain.com/auth/callback/github</code></pre>
                </li>
              </ul>
            </li>
            <li>Click <strong>Register application</strong></li>
          </ol>
        </div>
      </div>

      <!-- Step 2 -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0"><span class="badge bg-primary me-2">2</span>Generate Client Secret</h5>
        </div>
        <div class="card-body">
          <ol>
            <li class="mb-2">In your OAuth App settings, click <strong>Generate a new client secret</strong></li>
            <li class="mb-2">Copy both the <strong>Client ID</strong> and <strong>Client Secret</strong></li>
          </ol>
          <div class="alert alert-danger">
            <strong>Important:</strong> The client secret should NEVER be exposed in frontend code.
            Store it securely on your backend server.
          </div>
        </div>
      </div>

      <!-- Backend Required -->
      <div class="card mb-4 border-warning">
        <div class="card-header bg-warning text-dark">
          <h5 class="mb-0"><i class="ri-server-line me-2"></i>Backend Required</h5>
        </div>
        <div class="card-body">
          <p>Unlike OIDC, GitHub's OAuth2 flow requires a backend to:</p>
          <ol>
            <li>Receive the authorization code from the callback</li>
            <li>Exchange the code for an access token (using client secret)</li>
            <li>Fetch user info from GitHub API</li>
            <li>Create or link the user in your system</li>
            <li>Return a session token to the frontend</li>
          </ol>
          <pre class="bg-dark text-light p-3 rounded"><code>// Backend endpoint example (Node.js)
app.get('/api/auth/github/callback', async (req, res) => {{ '{' }}
  const code = req.query.code;
  
  // Exchange code for token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {{ '{' }}
    method: 'POST',
    headers: {{ '{' }} 'Accept': 'application/json' {{ '}' }},
    body: JSON.stringify({{ '{' }}
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    {{ '}' }})
  {{ '}' }});
  
  // ... fetch user info, create session, redirect
{{ '}' }});</code></pre>
        </div>
      </div>

      <!-- Current Status -->
      <div class="card">
        <div class="card-header bg-secondary text-white">
          <h5 class="mb-0"><i class="ri-code-line me-2"></i>Current Implementation Status</h5>
        </div>
        <div class="card-body">
          <p>GitHub OAuth is currently a <strong>stub</strong> in the frontend:</p>
          <ul>
            <li>Button appears in provider list (when enabled)</li>
            <li>Clicking it would redirect to GitHub</li>
            <li>Callback handling requires backend implementation</li>
          </ul>
          <p class="text-muted mb-0">
            To fully implement GitHub auth, create a backend endpoint that handles 
            the OAuth2 authorization code flow.
          </p>
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
export class GitHubOAuthDocComponent { }
