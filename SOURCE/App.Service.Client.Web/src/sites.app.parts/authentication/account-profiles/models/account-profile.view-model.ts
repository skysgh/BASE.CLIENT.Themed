/**
 * Account Profile View Model
 */
export interface AccountProfileViewModel {
  id: string;
  userId: string;
  accountId: string;
  
  // Membership
  joinedAt: Date;
  isActive: boolean;
  expiresAt: Date | null;
  
  // Identity in this account
  displayNameOverride: string | null;
  jobTitle: string | null;
  department: string | null;
  
  // UI State
  lastAccessedAt: Date | null;
  favoriteItemIds: string[];
  collapsedSections: string[];
  dashboardLayout: 'default' | 'compact' | 'detailed';
  
  // Notifications
  notificationsEnabled: boolean;
  notificationDigest: 'realtime' | 'daily' | 'weekly' | 'none';
  
  // Computed
  membershipStatus: 'active' | 'inactive' | 'expired' | 'pending';
  membershipStatusClass: string;
  memberDuration: string;
}

/**
 * Compute membership status
 */
export function computeMembershipStatus(
  isActive: boolean,
  expiresAt: Date | null,
  joinedAt: Date
): { status: 'active' | 'inactive' | 'expired' | 'pending'; cssClass: string } {
  const now = new Date();
  
  if (!isActive) {
    return { status: 'inactive', cssClass: 'bg-secondary' };
  }
  
  if (expiresAt && now > expiresAt) {
    return { status: 'expired', cssClass: 'bg-danger' };
  }
  
  if (joinedAt > now) {
    return { status: 'pending', cssClass: 'bg-warning' };
  }
  
  return { status: 'active', cssClass: 'bg-success' };
}

/**
 * Format member duration
 */
export function formatMemberDuration(joinedAt: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - joinedAt.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays < 1) return 'Less than a day';
  if (diffDays === 1) return '1 day';
  if (diffDays < 30) return `${diffDays} days`;
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 month' : `${months} months`;
  }
  const years = Math.floor(diffDays / 365);
  return years === 1 ? '1 year' : `${years} years`;
}
