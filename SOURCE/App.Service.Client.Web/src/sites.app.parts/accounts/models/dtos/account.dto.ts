/**
 * Account DTO
 * 
 * Represents an account/tenant entity from the API.
 * This is the business entity for multi-tenant services.
 * 
 * Note: AccountConfig (in core/) is the bootstrap configuration loaded from JSON files.
 * This DTO is for account management operations (CRUD via API).
 */
export interface AccountDto {
  id: string;
  accountGuid: string;
  name: string;
  title: string;
  subtitle?: string;
  enabled: boolean;
  createdUtc: string;
  modifiedUtc?: string;
  
  // Branding
  logoLight?: string;
  logoDark?: string;
  primaryColor?: string;
  secondaryColor?: string;
  
  // Contact
  contactEmail?: string;
  supportEmail?: string;
  
  // Settings
  defaultLanguageCode?: string;
  timezone?: string;
}
