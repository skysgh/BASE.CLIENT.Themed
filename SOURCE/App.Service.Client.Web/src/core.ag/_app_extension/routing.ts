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
  //// app.module states bootstrap: [AppROComponent]
  //// so it already knows what control to load, and it happens to be a
  //// route controller.
  //// So no need to define again below

  //// so pages and landing (and auth, etc.) will be loaded directly within
  //// the AppROComponent. They also don't need to be gaurded - they're public access.

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

  // ✅ Account-based routes (e.g., /foo/pages, /bar/apps)
  // Only match if second segment is a known route pattern
  // ✅ ADDED: AccountGuard checks if account config was found
  { 
    path: ':accountId/dashboards', 
    component: AppLayoutComponent, 
    loadChildren: () => import('../../sites.anon/features/dashboard/module').then(m => m.BaseCoreDashboardsModule), 
    canActivate: [AccountGuard, AuthGuard]  // ← Validate account first, then auth
  },
  { 
    path: ':accountId/pages', 
    loadChildren: () => import('../../sites.anon/features/pages/module').then(m => m.BaseCoreSitesFeaturesPagesModule),
    canActivate: [AccountGuard]  // ← Validate account exists
  },
  { 
    path: ':accountId/apps', 
    component: AppLayoutComponent, 
    loadChildren: () => import('../../sites.app/module').then(m => m.BaseAppsModule), 
    canActivate: [AccountGuard, AuthGuard]  // ← Validate account first, then auth
  },
  { 
    path: ':accountId/dev', 
    component: AppLayoutComponent, 
    loadChildren: () => import('../../sites.app.dev/module').then(m => m.SitesAppDevModule)
    // No AuthGuard - developer tools accessible without login
  },
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
  { 
    path: ':accountId/auth', 
    loadChildren: () => import('../../themes/t1/features/user/account/module').then(m => m.BaseThemesV1FeaturesUserAccountModule),
    canActivate: [AccountGuard]  // ← Validate account exists
  },
  { 
    path: ':accountId/errors', 
    loadChildren: () => import('../../sites.app.parts/errors/module').then(m => m.ErrorsModule)
    // No guard - error pages should always be accessible
  },

  // ============================================================================
  // LEGACY ROUTES - Redirects for backward compatibility
  // ============================================================================

  // Dashboard routes - redirect to hub (dashboards not implemented yet)
  { 
    path: 'dashboards', 
    redirectTo: 'apps/system/hub',
    pathMatch: 'full'
  },
  { 
    path: 'dashboards/main', 
    redirectTo: 'apps/system/hub',
    pathMatch: 'full'
  },

  // ✅ Default routes (no account ID - uses 'default' account)
  { path: 'pages', loadChildren: () => import('../../sites.anon/features/pages/module').then(m => m.BaseCoreSitesFeaturesPagesModule) },
  { path: 'apps', component: AppLayoutComponent, loadChildren: () => import('../../sites.app/module').then(m => m.BaseAppsModule), canActivate: [AuthGuard] },
  { path: 'landing', redirectTo: 'pages/landing', pathMatch: 'full' },
  { path: 'information', redirectTo: 'pages/information', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('../../themes/t1/features/user/account/module').then(m => m.BaseThemesV1FeaturesUserAccountModule) },
  { path: 'errors', loadChildren: () => import('../../sites.app.parts/errors/module').then(m => m.ErrorsModule) },

  { path: '', redirectTo: 'pages', pathMatch: 'full' },

  // ✅ Catch-all: Unknown routes go to error page
  { path: '**', redirectTo: 'errors/404' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
/**
 * Routing Module invoked from root AppModule.
 */
export class AppExtensionRoutingModule {
  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug("AppRoutingModule.constructor()");
  }
}
