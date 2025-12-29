import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
 * Used by:
 * - Information pages (privacy, terms, etc.)
 * - Account administration
 * - Compliance reporting
 * 
 * Note: This module is LAZY LOADED to defer PDF library loading
 * until the user actually views a statement.
 */
@NgModule({
  declarations: [],
  providers: [],
  imports: [CommonModule],
  exports: []
})
export class ServiceComplianceAppletModule { }
