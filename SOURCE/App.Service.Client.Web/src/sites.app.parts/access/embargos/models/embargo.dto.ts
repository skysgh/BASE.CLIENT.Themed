/**
 * Embargo DTO
 * 
 * Represents a country embargo/restriction.
 * Used for geographical access control and compliance.
 */
export interface EmbargoDto {
  /** Unique identifier */
  id: string;
  
  /** ISO 3166-1 alpha-2 country code (e.g., 'RU', 'KP', 'IR') */
  countryCode: string;
  
  /** Human-readable country name */
  countryName: string;
  
  /** Reason for embargo (compliance, legal, business) */
  reason: string;
  
  /** Optional legal reference (regulation, law citation) */
  legalReference?: string;
  
  /** When the embargo becomes effective */
  effectiveFrom: string;
  
  /** When the embargo ends (null = indefinite) */
  effectiveTo: string | null;
  
  /** Whether the embargo is currently active */
  enabled: boolean;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Create Embargo Request
 */
export interface CreateEmbargoDto {
  countryCode: string;
  countryName: string;
  reason: string;
  legalReference?: string;
  effectiveFrom?: string;
  effectiveTo?: string | null;
  enabled?: boolean;
}

/**
 * Update Embargo Request
 */
export interface UpdateEmbargoDto {
  reason?: string;
  legalReference?: string;
  effectiveFrom?: string;
  effectiveTo?: string | null;
  enabled?: boolean;
}

/**
 * Embargo reason types
 */
export type EmbargoReasonType = 
  | 'sanctions'      // Government sanctions
  | 'compliance'     // Regulatory compliance
  | 'legal'          // Legal restrictions
  | 'business'       // Business decision
  | 'technical';     // Technical limitations

/**
 * Well-known embargoed countries (for reference)
 * Based on common international sanctions lists
 */
export const COMMON_EMBARGO_COUNTRIES = [
  { code: 'KP', name: 'North Korea', reason: 'sanctions' },
  { code: 'IR', name: 'Iran', reason: 'sanctions' },
  { code: 'SY', name: 'Syria', reason: 'sanctions' },
  { code: 'CU', name: 'Cuba', reason: 'sanctions' },
  { code: 'RU', name: 'Russia', reason: 'sanctions' },
  { code: 'BY', name: 'Belarus', reason: 'sanctions' },
] as const;
