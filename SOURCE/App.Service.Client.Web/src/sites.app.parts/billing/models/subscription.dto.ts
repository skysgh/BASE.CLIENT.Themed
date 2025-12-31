/**
 * Subscription DTO
 * 
 * A Subscription is the RELATIONSHIP between an Account and a Plan.
 * 
 * Implements:
 * - IHasUUID: Has id field
 * - IHasStatus: Has status field
 * - IHasMoney: Has amountCents and currency
 * - IHasTimestamps: Has createdUtc/modifiedUtc
 * - IHasMetadata: Has flexible key-value pairs
 * - IHasExternalId: Links to payment provider (Stripe Subscription ID)
 */
import { IHasUUID } from '../../../core/models/contracts/IHasUUID';
import { IHasStatus } from '../../../core/models/contracts/IHasStatus';
import { IHasMoney } from '../../../core/models/contracts/IHasMoney';
import { IHasTimestamps } from '../../../core/models/contracts/IHasTimestamps';
import { IHasMetadata } from '../../../core/models/contracts/IHasMetadata';
import { IHasExternalId } from '../../../core/models/contracts/IHasExternalId';

/**
 * Subscription status
 */
export type SubscriptionStatus = 
  | 'trialing'        // In free trial period
  | 'active'          // Paid and active
  | 'past_due'        // Payment failed, still accessible
  | 'unpaid'          // Multiple payment failures
  | 'paused'          // Temporarily paused by user
  | 'cancelled'       // User cancelled, access until period end
  | 'expired'         // Period ended, no renewal
  | 'incomplete';     // Setup not completed

/**
 * Billing interval
 */
export type BillingInterval = 'monthly' | 'yearly' | 'weekly' | 'quarterly' | 'one_time';

/**
 * Subscription DTO
 */
export interface SubscriptionDto extends
  IHasUUID,
  IHasStatus<SubscriptionStatus>,
  IHasMoney,
  IHasTimestamps,
  IHasMetadata,
  IHasExternalId {
  
  /**
   * Reference to the BillingAccount (who pays)
   * KEY: Accounts subscribe, not people
   */
  accountId: string;

  /**
   * Reference to the Service (optional, for multi-service accounts)
   */
  serviceId?: string;

  /**
   * Reference to the current Plan
   * This changes when user upgrades/downgrades
   */
  planId: string;

  // ============================================
  // Denormalized fields (for convenience)
  // ============================================

  /**
   * Service name (denormalized)
   */
  serviceName?: string;

  /**
   * Plan name (for display)
   */
  planName: string;

  /**
   * Billing interval
   */
  interval: BillingInterval;

  // ============================================
  // Billing period
  // ============================================

  /**
   * Current period start date
   */
  currentPeriodStart: string;

  /**
   * Current period end date
   */
  currentPeriodEnd: string;

  /**
   * When the subscription started
   */
  startDate?: string;

  /**
   * Trial end date (if trialing)
   */
  trialEnd?: string;

  // ============================================
  // Cancellation
  // ============================================

  /**
   * Whether subscription will cancel at period end
   */
  cancelAtPeriodEnd: boolean;

  /**
   * Date subscription was cancelled (if applicable)
   */
  cancelledAt?: string;

  /**
   * When subscription actually ended
   */
  endedAt?: string;

  /**
   * Cancellation reason (optional)
   */
  cancellationReason?: string;

  // ============================================
  // Payment
  // ============================================

  /**
   * Default payment method ID for this subscription
   */
  defaultPaymentMethodId?: string;
}

/**
 * Create subscription request
 */
export interface CreateSubscriptionRequest {
  accountId: string;
  planId: string;
  paymentMethodId: string;
  couponCode?: string;
}

/**
 * Update subscription request (upgrade/downgrade)
 */
export interface UpdateSubscriptionRequest {
  planId?: string;
  paymentMethodId?: string;
  prorate?: boolean;
}

/**
 * Cancel subscription request
 */
export interface CancelSubscriptionRequest {
  atPeriodEnd: boolean;
  reason?: string;
}

/**
 * Helper to get subscription status badge class
 */
export function getSubscriptionStatusBadgeClass(status: SubscriptionStatus): string {
  const classes: Record<SubscriptionStatus, string> = {
    'active': 'bg-success-subtle text-success',
    'trialing': 'bg-info-subtle text-info',
    'past_due': 'bg-warning-subtle text-warning',
    'unpaid': 'bg-danger-subtle text-danger',
    'paused': 'bg-primary-subtle text-primary',
    'cancelled': 'bg-secondary-subtle text-secondary',
    'expired': 'bg-secondary-subtle text-secondary',
    'incomplete': 'bg-warning-subtle text-warning'
  };
  return classes[status] || 'bg-secondary-subtle text-secondary';
}

/**
 * Helper: Is subscription in good standing?
 */
export function isSubscriptionActive(status: SubscriptionStatus): boolean {
  return status === 'active' || status === 'trialing';
}

/**
 * Helper: Does subscription need attention?
 */
export function subscriptionNeedsAttention(status: SubscriptionStatus): boolean {
  return status === 'past_due' || status === 'unpaid' || status === 'incomplete';
}
