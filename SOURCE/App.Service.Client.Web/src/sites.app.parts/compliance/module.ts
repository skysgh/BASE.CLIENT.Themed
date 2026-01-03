import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Views
import { ComplianceHubComponent } from './ui/views/compliance-hub/component';
import { PrivacyPolicyComponent } from './ui/views/privacy-policy/component';
import { TermsConditionsComponent } from './ui/views/terms-conditions/component';
import { CookiePolicyComponent } from './ui/views/cookie-policy/component';
import { AccessibilityStatementComponent } from './ui/views/accessibility-statement/component';
import { DataCollectionComponent } from './ui/views/data-collection/component';

/**
 * Compliance Statements Module
 * 
 * Platform applet for legal/compliance document management.
 * Contains PDF viewers and heavy document rendering components.
 * 
 * NOTE: This module is lazy-loaded when users navigate to compliance pages.
 * For the lightweight cookie consent banner/overlay, use the separate
 * ComplianceCookieConsentModule which can be loaded on every page.
 * 
 * ROUTES:
 * - /system/compliance/         - Compliance hub
 * - /system/compliance/privacy  - Privacy Policy
 * - /system/compliance/terms    - Terms & Conditions  
 * - /system/compliance/cookies  - Cookie Policy
 * - /system/compliance/accessibility - Accessibility Statement
 * - /system/compliance/data-collection - Data Collection Statement
 */
@NgModule({
  declarations: [],
  providers: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ComplianceHubComponent },
      { path: 'privacy', component: PrivacyPolicyComponent },
      { path: 'terms', component: TermsConditionsComponent },
      { path: 'cookies', component: CookiePolicyComponent },
      { path: 'accessibility', component: AccessibilityStatementComponent },
      { path: 'data-collection', component: DataCollectionComponent },
    ]),
    // Standalone view components
    ComplianceHubComponent,
    PrivacyPolicyComponent,
    TermsConditionsComponent,
    CookiePolicyComponent,
    AccessibilityStatementComponent,
    DataCollectionComponent,
  ],
  exports: [
    RouterModule,
  ]
})
export class ComplianceStatementsModule { };

/**
 * @deprecated Use ComplianceStatementsModule instead.
 * Kept for backward compatibility during migration.
 */
export { ComplianceStatementsModule as ComplianceModule };
