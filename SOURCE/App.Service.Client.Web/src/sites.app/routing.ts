/**
 * Sites.App Routing Module (LEGACY)
 * 
 * ⚠️ DEPRECATED: This routing module is no longer the primary router.
 * 
 * Routes have been split into:
 * - /apps/*   → sites.app.lets/routing.module.ts (domain applets)
 * - /system/* → sites.app.parts/routing.module.ts (platform parts)
 * 
 * This file is kept for backward compatibility redirects only.
 * Will be removed after migration period.
 * 
 * @see _custom/documentation/architecture/ROUTE-RESTRUCTURING.md
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemDefaultServices } from '../core/services/system.default-services.service';

const routes: Routes = [
  // ============================================================================
  // LEGACY REDIRECTS
  // Redirect old /apps/system/* URLs to new /system/* URLs
  // TODO: Remove after migration period (users update bookmarks)
  // ============================================================================

  // Old: /apps/system/hub → New: /system/hub
  { path: 'system/hub', redirectTo: '/system/hub', pathMatch: 'full' },
  { path: 'system/settings', redirectTo: '/system/settings', pathMatch: 'full' },
  { path: 'system/trash', redirectTo: '/system/trash', pathMatch: 'full' },
  { path: 'system/messages', redirectTo: '/system/messages', pathMatch: 'full' },
  { path: 'system/support', redirectTo: '/system/support', pathMatch: 'full' },
  { path: 'system/about', redirectTo: '/system/about', pathMatch: 'full' },
  { path: 'system/billing', redirectTo: '/system/billing', pathMatch: 'full' },
  { path: 'system/notifications', redirectTo: '/system/notifications', pathMatch: 'full' },
  { path: 'system/wiki', redirectTo: '/system/wiki', pathMatch: 'full' },
  { path: 'system/help', redirectTo: '/system/help', pathMatch: 'full' },
  { path: 'system/authentication', redirectTo: '/system/authentication', pathMatch: 'full' },
  
  // Catch-all for any /apps/system/* → /system/*
  { path: 'system', redirectTo: '/system', pathMatch: 'prefix' },

  // Default: If someone goes to /apps with no path, send to spike applet
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
/**
 * @deprecated Use AppletsRoutingModule (sites.app.lets) instead
 */
export class BaseAppsRoutingModule {
  constructor(private defaultServices: SystemDefaultServices) {
    this.defaultServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor() - LEGACY REDIRECTS ONLY`);
  }
}
