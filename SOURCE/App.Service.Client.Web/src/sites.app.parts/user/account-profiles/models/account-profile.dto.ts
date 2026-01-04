/**
 * Account Profile DTO
 * 
 * Per-account user settings (1:N - one per Account the user belongs to).
 * Settings specific to a user's participation in a particular account/tenant.
 * 
 * Key Design:
 * - Profile points TO User (AccountProfile.userId)
 * - Also references Account (AccountProfile.accountId)
 * - This is a junction/relationship entity
 */
export interface AccountProfileDto {
  /** Unique identifier */
  id: string;
  
  /** Reference to User entity */
  userId: string;
  
  /** Reference to Account entity */
  accountId: string;
  
  // ─────────────────────────────────────────────────────────────
  // Membership Status
  // ─────────────────────────────────────────────────────────────
  
  /** When the user joined this account */
  joinedAt: string;
  
  /** Whether membership is currently active */
  isActive: boolean;
  
  /** Membership expiry (null = no expiry) */
  expiresAt: string | null;
  
  // ─────────────────────────────────────────────────────────────
  // Account-Specific Preferences
  // ─────────────────────────────────────────────────────────────
  
  /** Display name override for this account (null = use Person name) */
  displayNameOverride: string | null;
  
  /** Job title in this account context */
  jobTitle: string | null;
  
  /** Department in this account */
  department: string | null;
  
  // ─────────────────────────────────────────────────────────────
  // UI State (per-account)
  // ─────────────────────────────────────────────────────────────
  
  /** Last accessed timestamp for this account */
  lastAccessedAt: string | null;
  
  /** Favorite/pinned items in this account (JSON array of IDs) */
  favoriteItemIds: string[];
  
  /** Collapsed sidebar sections (JSON array of section IDs) */
  collapsedSections: string[];
  
  /** Dashboard layout preference for this account */
  dashboardLayout: 'default' | 'compact' | 'detailed';
  
  // ─────────────────────────────────────────────────────────────
  // Notifications (Account-specific)
  // ─────────────────────────────────────────────────────────────
  
  /** Receive notifications for this account */
  notificationsEnabled: boolean;
  
  /** Notification digest: 'realtime', 'daily', 'weekly', 'none' */
  notificationDigest: 'realtime' | 'daily' | 'weekly' | 'none';
  
  // ─────────────────────────────────────────────────────────────
  // Timestamps
  // ─────────────────────────────────────────────────────────────
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Create Account Profile (when user joins account)
 */
export interface CreateAccountProfileDto {
  accountId: string;
  displayNameOverride?: string;
  jobTitle?: string;
  department?: string;
}

/**
 * Update Account Profile
 */
export interface UpdateAccountProfileDto {
  displayNameOverride?: string | null;
  jobTitle?: string | null;
  department?: string | null;
  favoriteItemIds?: string[];
  collapsedSections?: string[];
  dashboardLayout?: 'default' | 'compact' | 'detailed';
  notificationsEnabled?: boolean;
  notificationDigest?: 'realtime' | 'daily' | 'weekly' | 'none';
}
