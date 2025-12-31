/**
 * Digital Identity DTO
 * 
 * Represents the trust relationship between a User and an external
 * Identity Provider (IdP) like Azure AD, Google, Facebook, etc.
 * 
 * Enables federated authentication: "Sign in with Google" maps to internal User.
 */
export interface DigitalIdentityDto {
  /** Unique identifier for this trust relationship */
  id: string;
  
  /** Reference to the internal User this identity belongs to */
  userId: string;
  
  /** Identity Provider identifier (e.g., 'azure-ad', 'google', 'facebook') */
  providerId: string;
  
  /** User's ID in the external system */
  externalUserId: string;
  
  /** Email associated with this identity (may differ from Person's email) */
  externalEmail: string | null;
  
  /** Display name from the IdP */
  externalDisplayName: string | null;
  
  /** When this identity link was established */
  linkedAt: string;
  
  /** When the user last authenticated via this IdP */
  lastAuthenticatedAt: string | null;
  
  /** Whether this identity link is currently active */
  enabled: boolean;
  
  /** Primary identity - used for profile sync */
  isPrimary: boolean;
}

/**
 * Link Digital Identity Request
 */
export interface LinkDigitalIdentityDto {
  providerId: string;
  externalUserId: string;
  externalEmail?: string;
  externalDisplayName?: string;
  isPrimary?: boolean;
}

/**
 * Supported Identity Providers
 */
export type IdentityProviderType = 
  | 'azure-ad'
  | 'google'
  | 'facebook'
  | 'apple'
  | 'microsoft'
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'custom-oidc'
  | 'custom-saml';

/**
 * Identity Provider metadata
 */
export interface IdentityProviderInfo {
  id: IdentityProviderType;
  name: string;
  icon: string;
  enabled: boolean;
  protocol: 'oidc' | 'saml' | 'oauth2';
}

/**
 * Well-known Identity Providers
 */
export const IDENTITY_PROVIDERS: IdentityProviderInfo[] = [
  { id: 'azure-ad', name: 'Microsoft Entra ID', icon: 'ri-microsoft-fill', enabled: true, protocol: 'oidc' },
  { id: 'google', name: 'Google', icon: 'ri-google-fill', enabled: true, protocol: 'oidc' },
  { id: 'facebook', name: 'Facebook', icon: 'ri-facebook-fill', enabled: false, protocol: 'oauth2' },
  { id: 'apple', name: 'Apple', icon: 'ri-apple-fill', enabled: false, protocol: 'oidc' },
  { id: 'github', name: 'GitHub', icon: 'ri-github-fill', enabled: true, protocol: 'oauth2' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'ri-linkedin-fill', enabled: false, protocol: 'oauth2' },
];
