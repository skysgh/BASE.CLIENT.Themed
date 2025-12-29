import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Service Compliance Applet Module
 * 
 * Bounded domain context for legal/compliance document management.
 * 
 * Contains:
 * - Statement (privacy, terms, data policies)
 * - StatementType (types of legal documents)
 * - TextMediaEncodingType (PDF, HTML, Markdown formats)
 * 
 * Features:
 * - Service-level default statements
 * - Per-account statement overrides
 * - Multi-language support
 * - Multiple document formats (PDF, HTML, Markdown)
 * 
 * ROUTES:
 * - /apps/compliance/         - Compliance hub
 * - /apps/compliance/privacy  - Privacy Policy
 * - /apps/compliance/terms    - Terms & Conditions  
 * - /apps/compliance/cookies  - Cookie Policy
 * - /apps/compliance/accessibility - Accessibility Statement
 * - /apps/compliance/data-collection - Data Collection Statement
 * 
 * Note: This module is LAZY LOADED to defer PDF library loading
 * until the user actually views a statement.
 */
@NgModule({
  declarations: [],
  providers: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        loadComponent: () => 
          import('./views/compliance-hub/component').then(m => m.ComplianceHubComponent)
      },
      {
        path: 'privacy',
        loadComponent: () => 
          import('./views/privacy-policy/component').then(m => m.PrivacyPolicyComponent)
      },
      {
        path: 'terms',
        loadComponent: () => 
          import('./views/terms-conditions/component').then(m => m.TermsConditionsComponent)
      },
      {
        path: 'cookies',
        loadComponent: () => 
          import('./views/cookie-policy/component').then(m => m.CookiePolicyComponent)
      },
      {
        path: 'accessibility',
        loadComponent: () => 
          import('./views/accessibility-statement/component').then(m => m.AccessibilityStatementComponent)
      },
      {
        path: 'data-collection',
        loadComponent: () => 
          import('./views/data-collection/component').then(m => m.DataCollectionComponent)
      },
    ])
  ],
  exports: [RouterModule]
})
export class ServiceComplianceAppletModule { }
