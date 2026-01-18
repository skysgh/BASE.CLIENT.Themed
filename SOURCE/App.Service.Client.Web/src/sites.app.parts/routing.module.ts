/**
 * Platform Parts Routing Module
 * 
 * Routes for /system/* - user-facing platform features.
 * These are system support features that authenticated users can access.
 * 
 * Route Structure:
 * - /system/hub           → Central landing page
 * - /system/messages      → Internal messaging
 * - /system/trash         → Recycle bin
 * - /system/support       → Help/support tickets
 * - /system/about         → App information
 * - /system/wiki          → Documentation wiki
 * - /system/billing       → User billing
 * - /system/notifications → Notification center
 * - /system/settings      → User & account settings
 * - /system/user          → Profile management (formerly authentication)
 * 
 * Note: Administrative routes (/admin/*) will be separate and role-gated.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // ============================================================================
  // USER-FACING SYSTEM FEATURES
  // ============================================================================

  // Hub - Central landing page with widgets
  { 
    path: 'hub', 
    loadChildren: () => import('./hub/module').then(m => m.HubModule)
  },

  // Messages - Internal messaging system
  { 
    path: 'messages', 
    loadChildren: () => import('./messages/module').then(m => m.MessagesModule)
  },

  // Trash - Deleted items recycle bin
  { 
    path: 'trash', 
    loadChildren: () => import('./trash/module').then(m => m.TrashModule)
  },

  // Support - Issue/idea submission and tracking
  { 
    path: 'support', 
    loadChildren: () => import('./support/module').then(m => m.SupportModule)
  },

  // About - Service information, version, licenses
  { 
    path: 'about', 
    loadChildren: () => import('./about/module').then(m => m.AboutModule)
  },

  // Help - User documentation and training
  { 
    path: 'help', 
    loadChildren: () => import('./help/module').then(m => m.HelpModule)
  },

  // Wiki - Full-featured wiki with namespace-based permissions
  { 
    path: 'wiki', 
    loadChildren: () => import('./wiki/module').then(m => m.WikiModule)
  },

  // Billing - Subscriptions, payment methods, transactions
  { 
    path: 'billing', 
    loadChildren: () => import('./billing/module').then(m => m.BillingModule)
  },

  // Notifications - Notification center and preferences
  { 
    path: 'notifications', 
    loadChildren: () => import('./notifications/module').then(m => m.NotificationsModule)
  },

  // Settings - User & account settings
  { 
    path: 'settings', 
    loadChildren: () => import('./settings/module').then(m => m.SettingsModule)
  },

  // Profile - User identity hub (personal info, security, etc.)
  { 
    path: 'profile', 
    loadChildren: () => import('./profile/module').then(m => m.ProfileModule)
  },

  // User - Admin user management, linked identities
  { 
    path: 'user', 
    loadChildren: () => import('./user/module').then(m => m.UserModule)
  },

  // Legacy redirect: /system/authentication → /system/user
  // Preserves backward compatibility for bookmarks and external links
  {
    path: 'authentication',
    redirectTo: 'user',
    pathMatch: 'prefix'
  },

  // Compliance - Legal documents (Privacy, Terms, etc.)
  { 
    path: 'compliance', 
    loadChildren: () => import('./compliance/module').then(m => m.ComplianceModule)
  },

  // Theme - Theme reference (developer tool, but user-accessible)
  { 
    path: 'theme', 
    loadChildren: () => import('./theme/module').then(m => m.ThemeModule)
  },

  // ============================================================================
  // ADMINISTRATIVE FEATURES (will move to /admin/* later)
  // For now, keep here but these should be role-gated
  // ============================================================================

  // Operate - Operations/Admin hub
  { 
    path: 'operate', 
    loadChildren: () => import('./operate/module').then(m => m.OperateModule)
  },

  // Accounts - Account management
  { 
    path: 'accounts', 
    loadChildren: () => import('./accounts/module').then(m => m.AccountsModule)
  },

  // Access - Geographical restrictions, embargoes
  { 
    path: 'access', 
    loadChildren: () => import('./access/module').then(m => m.AccessModule)
  },

  // Diagnostics - System logs and monitoring
  { 
    path: 'diagnostics', 
    loadChildren: () => import('./diagnostics/module').then(m => m.DiagnosticsModule)
  },

  // i18n - Language management
  { 
    path: 'i18n', 
    loadChildren: () => import('./i18n/module').then(m => m.I18nModule)
  },

  // Maintenance - Service status pages
  { 
    path: 'maintenance', 
    loadChildren: () => import('./maintenance/module').then(m => m.MaintenanceModule)
  },

  // ============================================================================
  // DEFAULT
  // ============================================================================
  { path: '', redirectTo: 'hub', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartsRoutingModule { }
