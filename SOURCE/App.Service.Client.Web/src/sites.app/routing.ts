/**
 * Sites.App Routing Module
 * 
 * Main routing for authenticated application.
 * 
 * Route Structure:
 * - /app/*            → Domain applets (sites.app.lets/) - what users came for
 * - /system/*         → Platform applets (sites.app.parts/) - system support
 * - /dev/*            → Developer tools - theme reference, integrations, etc.
 *   - /dev/theme/t1/* → Theme T1 (Velzon) reference (themes/t1.dev/)
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Configuration:
import { appsConfiguration } from '../sites.app/configuration/implementations/apps.configuration';
// Services:
import { SystemDefaultServices } from '../core/services/system.default-services.service';


const routes: Routes = [
  // ============================================================================
  // DOMAIN APPLETS - /app/* (sites.app.lets)
  // What users came for - business domain features
  // ============================================================================

  // Spike - Discovery/development app.let
  { 
    path: 'spike', 
    loadChildren: () => import('../sites.app.lets/spike/module').then(m => m.BaseAppsSpikeModule)
  },

  // Future domain applets:
  // { path: 'people', loadChildren: () => import('../sites.app.lets/people/module').then(m => m.PeopleModule) },
  // { path: 'catalog', loadChildren: () => import('../sites.app.lets/catalog/module').then(m => m.CatalogModule) },
  // { path: 'orders', loadChildren: () => import('../sites.app.lets/orders/module').then(m => m.OrdersModule) },

  // ============================================================================
  // PLATFORM APPLETS - /system/* (sites.app.parts)
  // System support features - what helps users use the app
  // ============================================================================

  // Authentication - Identity management (users, profiles, linked identities)
  { 
    path: 'system/authentication', 
    loadChildren: () => import('../sites.app.parts/authentication/module').then(m => m.AuthenticationModule)
  },

  // Billing - Subscriptions, payment methods, transactions
  { 
    path: 'system/billing', 
    loadChildren: () => import('../sites.app.parts/billing/module').then(m => m.BillingModule)
  },

  // Settings - Unified settings hub
  { 
    path: 'system/settings', 
    loadChildren: () => import('../sites.app.parts/settings/module').then(m => m.SettingsModule)
  },

  // About - Service information, version, licenses
  { 
    path: 'system/about', 
    loadChildren: () => import('../sites.app.parts/about/module').then(m => m.AboutModule)
  },

  // Compliance - Legal documents (Privacy, Terms, etc.)
  { 
    path: 'system/compliance', 
    loadChildren: () => import('../sites.app.parts/compliance/module').then(m => m.ComplianceModule)
  },

  // Search - Universal search (Browse in BREAD)
  { 
    path: 'system/search', 
    loadChildren: () => import('../sites.app.parts/search/module').then(m => m.SearchModule)
  },

  // Theme - Theme reference (developer tool)
  { 
    path: 'system/theme', 
    loadChildren: () => import('../sites.app.parts/theme/module').then(m => m.ThemeModule)
  },

  // Operate - Operations/Admin hub
  { 
    path: 'system/operate', 
    loadChildren: () => import('../sites.app.parts/operate/module').then(m => m.OperateModule)
  },

  // Accounts - Account management
  { 
    path: 'system/accounts', 
    loadChildren: () => import('../sites.app.parts/accounts/module').then(m => m.AccountsModule)
  },

  // ============================================================================
  // DEVELOPER TOOLS - /dev/*
  // Developer reference pages for theme, integrations, etc.
  // ============================================================================

  // Theme T1 (Velzon) Developer Reference
  // Path: /dev/theme/t1/minimal/icons, /dev/theme/t1/minimal/ui, etc.
  { 
    path: 'dev/theme/t1', 
    loadChildren: () => import('../themes/t1.dev/module').then(m => m.T1DevModule)
  },

  // Future developer tools:
  // { path: 'dev/integrations/stripe', loadChildren: () => ... },
  // { path: 'dev/integrations/oauth', loadChildren: () => ... },
  // { path: 'dev/integrations/oidc', loadChildren: () => ... },

  // Dev Hub - Redirect to theme for now
  { 
    path: 'dev', 
    redirectTo: 'dev/theme/t1',
    pathMatch: 'full'
  },

  // ============================================================================
  // LEGACY ROUTES - For backward compatibility during transition
  // TODO: Remove after full migration
  // ============================================================================
  
  // Legacy settings route (redirects to new location)
  { 
    path: 'settings', 
    redirectTo: 'system/settings',
    pathMatch: 'prefix'
  },

  // ============================================================================
  // DEFAULT
  // ============================================================================
  { path: '', redirectTo: 'spike', pathMatch: 'full' }
];


@NgModule({
  declarations: [],
  providers: [],
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class BaseAppsRoutingModule {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration;

  constructor(private defaultServices: SystemDefaultServices) {
    this.defaultServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
  }
}
