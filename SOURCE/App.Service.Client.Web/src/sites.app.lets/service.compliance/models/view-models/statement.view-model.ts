/**
 * Statement ViewModel
 * 
 * Presentation model for legal/compliance statements.
 */
export interface StatementViewModel {
  id: string;
  enabled: boolean;
  isAccountOverride: boolean;  // True if this is an account-specific override
  
  // Type info
  typeCode: string;
  typeName: string;
  
  // Encoding info
  encodingCode: string;
  encodingName: string;
  mimeType: string;
  
  // Content
  languageCode: string;
  version: string;
  title: string;
  summary: string;
  
  // For HTML/Markdown
  text?: string;
  
  // For PDF
  documentUrl?: string;
  
  // Dates
  issuedAt: Date;
  effectiveAt?: Date;
  expiresAt?: Date;
  
  // Computed
  displayLabel: string;
  isExpired: boolean;
  isEffective: boolean;
  isPdf: boolean;
}
