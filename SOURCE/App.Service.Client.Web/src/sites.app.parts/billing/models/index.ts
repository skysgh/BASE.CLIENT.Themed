/**
 * Barrel export for billing domain models
 * 
 * Domain Model Summary:
 * 
 * ENTITIES:
 * - BillingAccount: Group entity for billing/administration (who pays)
 * - AccountMembership: Person-Account relationship with role (who has access)
 * - Service: Abstract product type (what you offer)
 * - Plan: Packaged offering with quotas/features/price (how you sell it)
 * - Subscription: Account-Plan relationship (ongoing access)
 * - Order: One-time purchase by Account (cart/store scenario)
 * - PaymentMethod: Saved payment methods (cards, bank accounts)
 * - Transaction: Payment/refund records
 * 
 * KEY INSIGHTS:
 * 1. Accounts subscribe, not people. People access through membership.
 * 2. Subscription points to Plan. Upgrade/downgrade = change Plan.
 * 3. Orders don't require Subscriptions (e.g., Amazon without Prime).
 */

// Core entities
export * from './billing-account.dto';
export * from './account-membership.dto';

// Product catalog
export * from './service.dto';
// Re-export plan.dto but handle BillingInterval conflict with subscription.dto
export { 
  PlanDto, 
  PlanSummaryDto, 
  PlanQuotaDto, 
  PlanFeatureDto,
  PlanStatus,
  PlanTier,
  BillingInterval,  // Use plan.dto's version (more complete)
  formatPlanPrice,
  getCurrencySymbol,
  getIntervalLabel,
  getTierBadgeClass
} from './plan.dto';

// Purchasing
// Re-export subscription.dto but exclude BillingInterval (already exported from plan.dto)
export { 
  SubscriptionDto, 
  SubscriptionStatus,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  CancelSubscriptionRequest,
  getSubscriptionStatusBadgeClass,
  isSubscriptionActive,
  subscriptionNeedsAttention
} from './subscription.dto';
export * from './order.dto';

// Payment
// Re-export payment-method.dto but exclude BillingAddressDto (already exported from billing-account.dto)
export { 
  PaymentMethodDto, 
  PaymentMethodType, 
  CardBrand,
  CreatePaymentMethodRequest,
  getCardBrandIcon,
  formatExpiry
} from './payment-method.dto';
export * from './transaction.dto';
