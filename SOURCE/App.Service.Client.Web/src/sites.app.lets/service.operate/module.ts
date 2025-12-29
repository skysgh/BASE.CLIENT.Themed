import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Service Operate Applet Module
 * 
 * Bounded domain context for operational/runtime concerns.
 * Contains entities for service operations:
 * - Notification (user alerts and notifications)
 * - Language (i18n reference data)
 * - User (system users)
 * - Embargo (trade restrictions)
 * - CountryExcluded (service availability)
 * 
 * Used by:
 * - All sites (admin, anon, app)
 * - Core infrastructure components
 * - Layout components (topbar, notifications, language selector)
 */
@NgModule({
  declarations: [],
  providers: [],
  imports: [CommonModule],
  exports: []
})
export class ServiceOperateAppletModule { }
