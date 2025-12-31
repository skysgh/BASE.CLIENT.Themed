import { IdentityProviderType, IDENTITY_PROVIDERS } from './digital-identity.dto';

/**
 * Digital Identity View Model
 * 
 * Presentation-ready digital identity data.
 */
export interface DigitalIdentityViewModel {
  id: string;
  userId: string;
  providerId: IdentityProviderType;
  externalUserId: string;
  externalEmail: string | null;
  externalDisplayName: string | null;
  linkedAt: Date;
  lastAuthenticatedAt: Date | null;
  enabled: boolean;
  isPrimary: boolean;
  
  // Computed for UI
  providerName: string;
  providerIcon: string;
  lastUsedLabel: string;
}

/**
 * Get provider display info
 */
export function getProviderInfo(providerId: string): { name: string; icon: string } {
  const provider = IDENTITY_PROVIDERS.find(p => p.id === providerId);
  return provider 
    ? { name: provider.name, icon: provider.icon }
    : { name: providerId, icon: 'ri-link' };
}

/**
 * Format "last used" as human-readable
 */
export function formatLastUsed(lastAuth: Date | null): string {
  if (!lastAuth) return 'Never used';
  
  const now = new Date();
  const diffMs = now.getTime() - lastAuth.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}
