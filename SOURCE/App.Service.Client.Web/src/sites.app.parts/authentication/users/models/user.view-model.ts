/**
 * User View Model
 * 
 * Presentation-ready user data.
 * Enriched with derived/computed properties for UI.
 */
export interface UserViewModel {
  id: string;
  personId: string;
  enabled: boolean;
  validFrom: Date | null;
  validTo: Date | null;
  createdAt: Date;
  updatedAt: Date;
  
  // Computed properties for UI
  /** Whether the user is currently within their valid date range */
  isCurrentlyValid: boolean;
  
  /** Human-readable status: 'Active', 'Disabled', 'Expired', 'Pending' */
  statusLabel: string;
  
  /** CSS class for status badge */
  statusClass: string;
}

/**
 * Compute user status from enabled flag and date range
 */
export function computeUserStatus(
  enabled: boolean, 
  validFrom: Date | null, 
  validTo: Date | null
): { isValid: boolean; label: string; cssClass: string } {
  const now = new Date();
  
  if (!enabled) {
    return { isValid: false, label: 'Disabled', cssClass: 'bg-secondary' };
  }
  
  if (validFrom && now < validFrom) {
    return { isValid: false, label: 'Pending', cssClass: 'bg-warning' };
  }
  
  if (validTo && now > validTo) {
    return { isValid: false, label: 'Expired', cssClass: 'bg-danger' };
  }
  
  return { isValid: true, label: 'Active', cssClass: 'bg-success' };
}
