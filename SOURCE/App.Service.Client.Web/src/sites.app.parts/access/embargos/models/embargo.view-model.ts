/**
 * Embargo View Model
 * 
 * UI-friendly representation of an embargo.
 * Includes computed properties for display.
 */
export interface EmbargoViewModel {
  /** Unique identifier */
  id: string;
  
  /** ISO 3166-1 alpha-2 country code */
  countryCode: string;
  
  /** Human-readable country name */
  countryName: string;
  
  /** Reason for embargo */
  reason: string;
  
  /** Optional legal reference */
  legalReference?: string;
  
  /** Effective from date */
  effectiveFrom: Date;
  
  /** Effective to date (null = indefinite) */
  effectiveTo: Date | null;
  
  /** Whether the embargo is active */
  enabled: boolean;
  
  /** Creation timestamp */
  createdAt: Date;
  
  /** Last update timestamp */
  updatedAt: Date;
  
  // === Computed Display Properties ===
  
  /** Display string: "Russia (RU)" */
  displayName: string;
  
  /** Status badge: "Active" | "Inactive" | "Scheduled" | "Expired" */
  status: EmbargoStatus;
  
  /** Status color for badges */
  statusColor: 'success' | 'warning' | 'danger' | 'secondary';
  
  /** Flag emoji (if available) */
  flagEmoji: string;
  
  /** Duration string: "Indefinite" | "Until Dec 2024" | "6 months" */
  durationDisplay: string;
  
  /** Is currently in effect */
  isCurrentlyActive: boolean;
}

/**
 * Embargo status enum
 */
export type EmbargoStatus = 
  | 'active'     // Currently in effect
  | 'inactive'   // Disabled
  | 'scheduled'  // Future effective date
  | 'expired';   // Past effective-to date

/**
 * Summary stats for dashboard
 */
export interface EmbargoStats {
  /** Total embargoes defined */
  total: number;
  
  /** Currently active embargoes */
  active: number;
  
  /** Inactive/disabled embargoes */
  inactive: number;
  
  /** Scheduled for future */
  scheduled: number;
  
  /** Total countries worldwide (UN members) */
  totalCountries: number;
  
  /** Countries available (not embargoed) */
  availableCountries: number;
  
  /** Percentage of world coverage */
  coveragePercent: number;
}
