import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Describe Applet Module (Platform Part)
 * 
 * Bounded domain context for service description content.
 * Contains entities that describe what the service is and does:
 * - Features (what the service does)
 * - Capabilities (service capabilities)
 * - FAQs (frequently asked questions)
 * - Endorsements (testimonials)
 * - TrustedBy (client logos)
 * - PricingPlans (pricing options)
 * - Stats (key metrics)
 * - DeliveryTeamMembers (team profiles)
 * 
 * Used by:
 * - sites.anon (landing pages, marketing)
 * - sites.app (admin management - future)
 * 
 * URL Prefix: /system/describe
 */
@NgModule({
  declarations: [],
  providers: [],
  imports: [CommonModule],
  exports: []
})
export class DescribeModule { }
