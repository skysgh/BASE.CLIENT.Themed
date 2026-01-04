// Import Ag:
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppLayoutComponent } from '../../themes/t1/components.layout/layout.component';

// ✅ MIGRATED: Guards now in core.ag (Angular-specific)
import { AuthGuard } from '../guards/auth.guard';
import { AccountGuard } from '../guards/account.guard';
import { SystemDiagnosticsTraceService } from '../../core/services/system.diagnostics-trace.service';

// Constants:


const routes: Routes = [
  // ============================================================================
  // DEVELOPER TOOLS - /dev/* (NO AUTH REQUIRED)
  // Developer reference pages accessible without authentication
  // ============================================================================
  { 
    path: 'dev', 
    component: AppLayoutComponent, 
    loadChildren: () => import('../../sites.app.dev/module').then(m => m.SitesAppDevModule)
    // No AuthGuard - developer tools accessible without login
  },

  // ============================================================================
  // ACCOUNT-PREFIXED ROUTES (e.g., /foo/apps, /bar/system)
  // ============================================================================
  
  // Account + Dashboards (legacy, redirects to system/hub)
  { 
    path: ':accountId/dashboards', 
    redirectTo: ':accountId/system/hub',
    pathMatch: 'full'
  },
  { 
    path: ':accountId/dashboards/main', 
    redirectTo: ':accountId/system/hub',
    pathMatch: 'full'
  },
  
  // Account + Pages (public, no auth required)
  { 
    path: ':accountId/pages', 
    loadChildren: () => import('../../sites.anon/features/pages/module').then(m => m.BaseCoreSitesFeaturesPagesModule),
    canActivate: [AccountGuard]
  },
  
  // Account + Apps (domain applets only - sites.app.lets)
  { 
    path: ':accountId/apps', 
    component: AppLayoutComponent, 
    loadChildren: () => import('../../sites.app.lets/routing.module').then(m => m.AppletsRoutingModule), 
    canActivate: [AccountGuard, AuthGuard]
  },
  
  // Account + System (platform parts - sites.app.parts)
  { 
    path: ':accountId/system', 
    component: AppLayoutComponent, 
    loadChildren: () => import('../../sites.app.parts/routing.module').then(m => m.PartsRoutingModule), 
    canActivate: [AccountGuard, AuthGuard]
  },
  
  // Account + Dev
  { 
    path: ':accountId/dev', 
    component: AppLayoutComponent, 
    loadChildren: () => import('../../sites.app.dev/module').then(m => m.SitesAppDevModule)
  },
  
  // Account + Auth
  { 
    path: ':accountId/auth', 
    loadChildren: () => import('../../themes/t1/features/user/account/module').then(m => m.BaseThemesV1FeaturesUserAccountModule),
    canActivate: [AccountGuard]
  },
  
  // Account + Errors
  { 
    path: ':accountId/errors', 
    loadChildren: () => import('../../sites.app.parts/errors/module').then(m => m.ErrorsModule)
  },
  
  // Account redirects
  { 
    path: ':accountId/landing', 
    redirectTo: ':accountId/pages/landing', 
    pathMatch: 'full'
  },
  { 
    path: ':accountId/information', 
    redirectTo: ':accountId/pages/information', 
    pathMatch: 'full'
  },
  // ✅ NEW: Bare account ID redirects to account's pages
  // e.g., /bar → /bar/pages
  { 
    path: ':accountId', 
    redirectTo: ':accountId/pages', 
    pathMatch: 'full'
  },

  // ============================================================================
  // DEFAULT ROUTES (no account prefix - uses 'default' account)
  // ============================================================================

  // Dashboard redirects to system/hub
  { 
    path: 'dashboards', 
    redirectTo: 'system/hub',
    pathMatch: 'full'
  },
  { 
    path: 'dashboards/main', 
    redirectTo: 'system/hub',
    pathMatch: 'full'
  },

  // Pages (public)
  { 
    path: 'pages', 
    loadChildren: () => import('../../sites.anon/features/pages/module').then(m => m.BaseCoreSitesFeaturesPagesModule) 
  },
  
  // Apps (domain applets only)
  { 
    path: 'apps', 
    component: AppLayoutComponent, 
    loadChildren: () => import('../../sites.app.lets/routing.module').then(m => m.AppletsRoutingModule), 
    canActivate: [AuthGuard] 
  },
  
  // System (platform parts)
  { 
    path: 'system', 
    component: AppLayoutComponent, 
    loadChildren: () => import('../../sites.app.parts/routing.module').then(m => m.PartsRoutingModule), 
    canActivate: [AuthGuard] 
  },
  
  // Auth
  { 
    path: 'auth', 
    loadChildren: () => import('../../themes/t1/features/user/account/module').then(m => m.BaseThemesV1FeaturesUserAccountModule) 
  },
  
  // Errors
  { 
    path: 'errors', 
    loadChildren: () => import('../../sites.app.parts/errors/module').then(m => m.ErrorsModule) 
  },
  
  // Convenience redirects
  { path: 'landing', redirectTo: 'pages/landing', pathMatch: 'full' },
  { path: 'information', redirectTo: 'pages/information', pathMatch: 'full' },

  // ============================================================================
  // LEGACY REDIRECTS - Backward compatibility for /apps/system/* URLs
  // ============================================================================
  // TODO: Remove after migration period
  
  // Default
  { path: '', redirectTo: 'pages', pathMatch: 'full' },

  // Catch-all: Unknown routes go to error page
  { path: '**', redirectTo: 'errors/404' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
/**
 * Root Routing Module
 * 
 * Route Structure:
 * - /apps/*      → Domain applets (sites.app.lets/) - what users came for
 * - /system/*    → Platform parts (sites.app.parts/) - system support features
 * - /pages/*     → Public pages (sites.anon/) - landing, info, etc.
 * - /auth/*      → Authentication flows
 * - /dev/*       → Developer tools
 * - /errors/*    → Error pages
 * 
 * All routes support account prefix: /foo/apps/*, /foo/system/*, etc.
 */
export class AppExtensionRoutingModule {
  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug("AppRoutingModule.constructor()");
  }
}
