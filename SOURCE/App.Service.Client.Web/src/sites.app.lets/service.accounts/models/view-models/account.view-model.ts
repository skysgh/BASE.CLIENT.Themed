/**
 * Account ViewModel
 * 
 * Presentation model for account/tenant management UI.
 */
export interface AccountViewModel {
  id: string;
  accountGuid: string;
  name: string;
  title: string;
  subtitle: string;
  enabled: boolean;
  createdAt: Date;
  modifiedAt?: Date;
  
  // Branding
  logoLight: string;
  logoDark: string;
  primaryColor: string;
  secondaryColor: string;
  
  // Contact
  contactEmail: string;
  supportEmail: string;
  
  // Settings
  defaultLanguageCode: string;
  timezone: string;
  
  // Computed
  displayLabel: string;
  isActive: boolean;
  ageInDays: number;
}
