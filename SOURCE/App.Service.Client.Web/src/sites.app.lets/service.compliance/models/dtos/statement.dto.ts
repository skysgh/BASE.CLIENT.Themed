/**
 * Statement DTO
 * 
 * Represents a legal/policy statement for a service.
 * Supports service-level defaults with per-account overrides.
 * 
 * Examples: Privacy Policy, Terms of Service, Data Use Policy, Cookie Policy
 */
export interface StatementDto {
  id: string;
  enabled: boolean;
  serviceFK?: string;
  accountFK?: string;        // If set, overrides service-level statement
  typeFK: string;            // References StatementType
  encodingTypeFK: string;    // References TextMediaEncodingType (PDF, HTML, Markdown)
  languageCode: string;
  version: string;
  issuedUtc: string;
  effectiveUtc?: string;
  expiresUtc?: string;
  title: string;
  summary?: string;
  text?: string;             // For HTML/Markdown content
  documentUrl?: string;      // For PDF content
}
