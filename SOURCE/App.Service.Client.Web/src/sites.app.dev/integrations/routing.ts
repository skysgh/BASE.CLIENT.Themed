/**
 * Integrations Routing
 * 
 * Routes for integration documentation.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthIntegrationHubComponent } from './auth/auth-hub.component';
import { MicrosoftOidcDocComponent } from './auth/microsoft-oidc.component';
import { GoogleOidcDocComponent } from './auth/google-oidc.component';
import { GitHubOAuthDocComponent } from './auth/github-oauth.component';
import { LocalAuthDocComponent } from './auth/local-auth.component';

const routes: Routes = [
  // Redirect root to auth
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },

  // Auth integration hub
  {
    path: 'auth',
    component: AuthIntegrationHubComponent
  },

  // Provider-specific docs
  {
    path: 'auth/microsoft',
    component: MicrosoftOidcDocComponent
  },
  {
    path: 'auth/google',
    component: GoogleOidcDocComponent
  },
  {
    path: 'auth/github',
    component: GitHubOAuthDocComponent
  },
  {
    path: 'auth/local',
    component: LocalAuthDocComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegrationsRoutingModule { }
