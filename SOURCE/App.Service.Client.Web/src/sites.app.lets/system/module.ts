import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * System Applet Module
 * 
 * Bounded domain context for cross-cutting system infrastructure.
 * Contains:
 * - Notification (system alerts)
 * - Language (i18n reference data)
 * - User (system users)
 * - Embargo (trade restrictions)
 * - CountryExcluded (service availability)
 * - StatementType (document types)
 * - TextMediaEncodingType (encoding formats)
 * 
 * Used by:
 * - All sites (admin, anon, app)
 * - Core infrastructure components
 */
@NgModule({
  declarations: [],
  providers: [],
  imports: [CommonModule],
  exports: []
})
export class SystemAppletModule { }
