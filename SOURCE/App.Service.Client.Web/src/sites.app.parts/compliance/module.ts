import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Views
import { ComplianceHubComponent } from './views/compliance-hub/component';
import { PrivacyPolicyComponent } from './views/privacy-policy/component';
import { TermsConditionsComponent } from './views/terms-conditions/component';
import { CookiePolicyComponent } from './views/cookie-policy/component';
import { AccessibilityStatementComponent } from './views/accessibility-statement/component';
import { DataCollectionComponent } from './views/data-collection/component';

/**
 * Compliance Applet Module
 * 
 * Platform applet for legal/compliance document management.
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
    // Standalone components
    ComplianceHubComponent,
    PrivacyPolicyComponent,
    TermsConditionsComponent,
    CookiePolicyComponent,
    AccessibilityStatementComponent,
    DataCollectionComponent,
  ],
  exports: [RouterModule]
})
export class ComplianceModule { }
