/**
 * Subscription DTO
 * 
 * Represents a subscription to a pricing plan.
 * Links user to a plan with billing cycle.
 */

/**
 * Subscription status
 */
export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'expired' | 'trialing' | 'paused';

/**
 * Billing interval
 */
export type BillingInterval = 'monthly' | 'yearly' | 'weekly' | 'one_time';

/**
 * Subscription DTO
 */
export interface SubscriptionDto {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Current status
   */
  status: SubscriptionStatus;

  /**
   * Plan ID this subscription is for
   */
  planId: string;

  /**
   * Plan name (for display)
   */
  planName: string;

  /**
   * Billing interval
   */
  interval: BillingInterval;

  /**
   * Amount per billing period (in cents)
   */
  amountCents: number;

  /**
   * Currency code
   */
  currency: string;

  /**
   * Current period start date
   */
  currentPeriodStart: string;

  /**
   * Current period end date
   */
  currentPeriodEnd: string;

  /**
   * Date subscription was cancelled (if applicable)
   */
  cancelledAt?: string;

  /**
   * Whether subscription will cancel at period end
   */
  cancelAtPeriodEnd: boolean;

  /**
   * Trial end date (if trialing)
   */
  trialEnd?: string;

  /**
   * Default payment method ID for this subscription
   */
  defaultPaymentMethodId?: string;

  /**
   * External subscription ID from payment provider
   */
  externalId?: string;

  /**
   * Created timestamp
   */
  createdUtc?: string;

  /**
   * Modified timestamp
   */
  modifiedUtc?: string;
}

/**
 * Create subscription request
 */
export interface CreateSubscriptionRequest {
  planId: string;
  paymentMethodId: string;
  couponCode?: string;
}

/**
 * Helper to get subscription status badge class
 */
export function getSubscriptionStatusBadgeClass(status: SubscriptionStatus): string {
  const classes: Record<SubscriptionStatus, string> = {
    'active': 'bg-success-subtle text-success',
    'past_due': 'bg-warning-subtle text-warning',
    'cancelled': 'bg-danger-subtle text-danger',
    'expired': 'bg-secondary-subtle text-secondary',
    'trialing': 'bg-info-subtle text-info',
    'paused': 'bg-primary-subtle text-primary'
  };
  return classes[status] || 'bg-secondary-subtle text-secondary';
}
