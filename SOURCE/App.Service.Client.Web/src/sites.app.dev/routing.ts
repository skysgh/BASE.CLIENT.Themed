/**
 * Sites.App.Dev Routing
 * 
 * Developer tools routing with cascading redirects:
 * /dev → dev hub
 * /dev/theme → /dev/theme/t1
 * /dev/theme/t1 → /dev/theme/t1/minimal
 * /dev/guides → guides hub
 * 
 * Supports:
 * - Theme reference pages
 * - Integration guides (auth, payments, etc.)
 * - Schema DSL documentation
 * - Wiki preview (for testing without auth)
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevHubComponent } from './ui/views/dev-hub/component';

const routes: Routes = [
  // Dev Hub - overview of all developer tools
  {
    path: '',
    component: DevHubComponent
  },

  // Theme T1 (Velzon) reference
  // Redirect chain: /dev/theme → /dev/theme/t1 → /dev/theme/t1/minimal
  {
    path: 'theme',
    redirectTo: 'theme/t1',
    pathMatch: 'full'
  },
  {
    path: 'theme/t1',
    loadChildren: () => import('../themes/t1.dev/module').then(m => m.T1DevModule)
  },

  // Integrations documentation
  {
    path: 'integrations',
    loadChildren: () => import('./integrations/module').then(m => m.IntegrationsModule)
  },

  // Guides - Developer documentation
  {
    path: 'guides/schema-dsl',
    loadChildren: () => import('./guides/schema-dsl/module').then(m => m.SchemaDslGuidesModule)
  },

  // Wiki preview - for testing wiki without authentication
  // Access at: /dev/wiki
  {
    path: 'wiki',
    loadChildren: () => import('../sites.app.parts/wiki/module').then(m => m.WikiModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SitesAppDevRoutingModule { }
