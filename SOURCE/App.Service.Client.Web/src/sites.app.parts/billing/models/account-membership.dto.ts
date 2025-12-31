/**
 * Account Membership DTO
 * 
 * The relationship between a Person and a BillingAccount.
 * 
 * Implements:
 * - IHasUUID: Has id field
 * - IHasStatus: Has status field
 * - IHasTimestamps: Has createdUtc/modifiedUtc
 */
import { IHasUUID } from '../../../core/models/contracts/IHasUUID';
import { IHasStatus } from '../../../core/models/contracts/IHasStatus';
import { IHasTimestamps } from '../../../core/models/contracts/IHasTimestamps';

/**
 * Account membership role
 * Based on RASCI but simplified for practical use
 */
export type AccountRole = 
  | 'owner'         // (A) Accountable - Full control, billing responsibility, can close account
  | 'admin'         // (R) Responsible - Manage users, settings, but not billing
  | 'billing'       // Billing manager - View/manage payment methods and invoices
  | 'user'          // (S) Supportive - Access to services
  | 'viewer';       // (I) Informed - Read-only access

/**
 * Membership status
 */
export type MembershipStatus = 
  | 'active'        // Normal access
  | 'invited'       // Invitation sent, not yet accepted
  | 'suspended'     // Temporarily suspended
  | 'removed';      // No longer a member

/**
 * Account Membership DTO
 * Links a Person to a BillingAccount with a specific role
 */
export interface AccountMembershipDto extends
  IHasUUID,
  IHasStatus<MembershipStatus>,
  IHasTimestamps {
  
  /**
   * Reference to the BillingAccount
   */
  accountId: string;

  /**
   * Reference to the Person (user)
   * This is the person's identity, not their profile
   */
  personId: string;

  /**
   * Person's display name (denormalized for convenience)
   */
  personName?: string;

  /**
   * Person's email (denormalized for convenience)
   */
  personEmail?: string;

  /**
   * Role within this account
   */
  role: AccountRole;

  /**
   * Optional: Custom title within the account
   * Examples: "CEO", "Family Admin", "IT Manager"
   */
  title?: string;

  /**
   * When the membership started
   */
  startDate: string;

  /**
   * When the membership ended (null if still active)
   */
  endDate?: string;

  /**
   * Who invited this member (personId of inviter)
   */
  invitedBy?: string;

  /**
   * Invitation accepted timestamp
   */
  acceptedAt?: string;
}

/**
 * Invite member request
 */
export interface InviteMemberRequest {
  email: string;
  role: AccountRole;
  title?: string;
  message?: string;  // Optional personal message in invitation
}

/**
 * Update membership request
 */
export interface UpdateMembershipRequest {
  role?: AccountRole;
  title?: string;
  status?: MembershipStatus;
}

/**
 * Helper: Get role display name
 */
export function getRoleDisplayName(role: AccountRole): string {
  const names: Record<AccountRole, string> = {
    'owner': 'Owner',
    'admin': 'Administrator',
    'billing': 'Billing Manager',
    'user': 'User',
    'viewer': 'Viewer'
  };
  return names[role] || role;
}

/**
 * Helper: Get role description
 */
export function getRoleDescription(role: AccountRole): string {
  const descriptions: Record<AccountRole, string> = {
    'owner': 'Full control including billing and account closure',
    'admin': 'Manage users and settings, but not billing',
    'billing': 'View and manage payment methods and invoices',
    'user': 'Access to services included in subscriptions',
    'viewer': 'Read-only access to account information'
  };
  return descriptions[role] || '';
}

/**
 * Helper: Can role manage billing?
 */
export function canManageBilling(role: AccountRole): boolean {
  return role === 'owner' || role === 'billing';
}

/**
 * Helper: Can role manage users?
 */
export function canManageUsers(role: AccountRole): boolean {
  return role === 'owner' || role === 'admin';
}
