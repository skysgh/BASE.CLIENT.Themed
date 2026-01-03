/**
 * Compliance Cookie Consent Module
 * 
 * Lightweight module for cookie consent UI widgets.
 * Designed to be loaded early on anonymous visits without
 * pulling in heavy PDF/document dependencies.
 * 
 * WIDGETS:
 * - <app-cookie-consent-banner> - Bottom banner for initial consent prompt
 * - <app-cookie-preferences-overlay> - Modal for managing cookie preferences
 * 
 * USAGE:
 * Import this module in your site's anonymous layout, then add:
 * ```html
 * <app-cookie-consent-banner></app-cookie-consent-banner>
 * <app-cookie-preferences-overlay></app-cookie-preferences-overlay>
 * ```
 * 
 * NOTE: For the full compliance statements (Privacy Policy, Terms, etc.)
 * with PDF viewing, use the separate ComplianceStatementsModule which
 * is lazy-loaded only when users navigate to those pages.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Cookie Consent Widgets (standalone)
import { CookieConsentBannerComponent } from './ui/widget/cookie-consent-banner/component';
import { CookiePreferencesOverlayComponent } from './ui/widget/cookie-preferences-overlay/component';

@NgModule({
  declarations: [],
  providers: [],
  imports: [
    CommonModule,
    // Standalone widgets
    CookieConsentBannerComponent,
    CookiePreferencesOverlayComponent,
  ],
  exports: [
    // Export for use in layouts
    CookieConsentBannerComponent,
    CookiePreferencesOverlayComponent,
  ]
})
export class ComplianceCookieConsentModule { }
