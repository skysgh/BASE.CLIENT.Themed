/**
 * Sites.App Routing Module
 * 
 * Main routing for authenticated application.
 * 
 * Route Structure:
 * - /app/*            → Domain applets (sites.app.lets/) - what users came for
 * - /system/*         → Platform applets (sites.app.parts/) - system support
 * - /errors/*         → Error pages - graceful degradation
 * - /dev/*            → Developer tools - theme reference, integrations, etc.
 *   - /dev/theme/t1/* → Theme T1 (Velzon) reference (themes/t1.dev/)
 *   - /dev/integrations/* → Integration guides (auth, payments, etc.)
 * 
 * Account Prefix Support:
 * All routes work with or without account prefix:
 * - /errors/404 (default account)
 * - /bar/errors/404 (account "bar")
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
  // Also available under /apps/* for convenience
  // ============================================================================

  // Search - Universal search (Browse in BREAD)
  // Available at both /apps/search and /system/search
  { 
    path: 'apps/search', 
    loadChildren: () => import('../sites.app.parts/search/module').then(m => m.SearchModule)
  },

  // Hub - Central landing page with widgets
  { 
    path: 'system/hub', 
    loadChildren: () => import('../sites.app.parts/hub/module').then(m => m.HubModule)
  },

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

  // Help - User documentation and training
  { 
    path: 'system/help', 
    loadChildren: () => import('../sites.app.parts/help/module').then(m => m.HelpModule)
  },

  // Wiki - Full-featured wiki with namespace-based permissions
  { 
    path: 'system/wiki', 
    loadChildren: () => import('../sites.app.parts/wiki/module').then(m => m.WikiModule)
  },

  // FAQ - Frequently Asked Questions with dynamic categories (app.let)
  { 
    path: 'system/faq', 
    loadChildren: () => import('../sites.app.lets/faq/module').then(m => m.FaqModule)
  },

  // Support - Issue/idea submission and tracking
  { 
    path: 'system/support', 
    loadChildren: () => import('../sites.app.parts/support/module').then(m => m.SupportModule)
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

  // Access - Geographical restrictions, embargoes
  { 
    path: 'system/access', 
    loadChildren: () => import('../sites.app.parts/access/module').then(m => m.AccessModule)
  },

  // Trash - Deleted items recycle bin
  { 
    path: 'system/trash', 
    loadChildren: () => import('../sites.app.parts/trash/module').then(m => m.TrashModule)
  },

  // Diagnostics - System logs and monitoring
  { 
    path: 'system/diagnostics', 
    loadChildren: () => import('../sites.app.parts/diagnostics/module').then(m => m.DiagnosticsModule)
  },

  // Notifications - Notification center and preferences
  { 
    path: 'system/notifications', 
    loadChildren: () => import('../sites.app.parts/notifications/module').then(m => m.NotificationsModule)
  },

  // i18n - Language management
  { 
    path: 'system/i18n', 
    loadChildren: () => import('../sites.app.parts/i18n/module').then(m => m.I18nModule)
  },

  // Messages - Internal messaging system
  { 
    path: 'system/messages', 
    loadChildren: () => import('../sites.app.parts/messages/module').then(m => m.MessagesModule)
  },

  // Surveys - Configurable surveys with conditional branching (app.let)
  { 
    path: 'system/surveys', 
    loadChildren: () => import('../sites.app.lets/surveys/module').then(m => m.SurveysModule)
  },

  // ============================================================================
  // ERROR PAGES - /errors/* (sites.app.parts/errors)
  // Graceful degradation - lazy loaded (errors are rare)
  // ============================================================================

  { 
    path: 'errors', 
    loadChildren: () => import('../sites.app.parts/errors/module').then(m => m.ErrorsModule)
  },

  // ============================================================================
  // MAINTENANCE PAGES - /system/maintenance (sites.app.parts/maintenance)
  // Service status - "we're down" notifications
  // ============================================================================

  { 
    path: 'system/maintenance', 
    loadChildren: () => import('../sites.app.parts/maintenance/module').then(m => m.MaintenanceModule)
  },

  // ============================================================================
  // DEVELOPER TOOLS - /dev/*
  // Developer reference pages for theme, integrations, etc.
  // ============================================================================

  // Dev Hub - shows overview with links to all dev tools
  { 
    path: 'dev', 
    loadChildren: () => import('../sites.app.dev/module').then(m => m.SitesAppDevModule)
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
  { path: '', redirectTo: 'system/hub', pathMatch: 'full' }
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
