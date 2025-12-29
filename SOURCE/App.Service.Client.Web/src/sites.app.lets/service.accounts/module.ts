import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Service Accounts Applet Module
 * 
 * Bounded domain context for multi-tenant account management.
 * 
 * Contains:
 * - Account (tenant management entity)
 * 
 * Used by:
 * - Multi-tenant SaaS services
 * - Account administration features
 * - Tenant switching functionality
 * 
 * Note: This is for account MANAGEMENT (CRUD operations).
 * Bootstrap-level account detection/loading remains in core/.
 * Not all services need multi-tenant support - this is optional.
 */
@NgModule({
  declarations: [],
  providers: [],
  imports: [CommonModule],
  exports: []
})
export class ServiceAccountsAppletModule { }
