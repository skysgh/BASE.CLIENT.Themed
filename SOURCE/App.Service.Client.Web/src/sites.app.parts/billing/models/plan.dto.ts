/**
 * Plan DTO
 * 
 * A Plan is a PACKAGED OFFERING of a Service.
 * It defines quotas, limits, features, and price.
 * 
 * Implements:
 * - IHasUUID: Has id field
 * - IHasTitleAndDescription: Has name (title) and description
 * - IHasStatus: Has status field
 * - IHasTimestamps: Has createdUtc/modifiedUtc
 * - IHasMetadata: Has flexible key-value pairs
 * - IHasExternalId: Links to payment provider (Stripe Price ID)
 * 
 * KEY INSIGHT: When you "upgrade" or "downgrade", the Subscription continues,
 * but the Plan associated with it changes.
 * 
 * Examples:
 * - Service: "Cloud Storage"
 *   - Plan: "Free" - 5GB, $0/month
 *   - Plan: "Basic" - 100GB, $5/month
 *   - Plan: "Pro" - 1TB, $15/month
 */
import { IHasUUID } from '../../../core/models/contracts/IHasUUID';
import { IHasTitleAndDescription } from '../../../core/models/contracts/IHasTitleAndDescription';
import { IHasStatus } from '../../../core/models/contracts/IHasStatus';
import { IHasTimestamps } from '../../../core/models/contracts/IHasTimestamps';
import { IHasMetadata } from '../../../core/models/contracts/IHasMetadata';
import { IHasExternalId } from '../../../core/models/contracts/IHasExternalId';

/**
 * Billing interval
 */
export type BillingInterval = 
  | 'once'      // One-time payment (lifetime)
  | 'daily'     // Daily billing
  | 'weekly'    // Weekly billing
  | 'monthly'   // Monthly billing
  | 'quarterly' // Every 3 months
  | 'yearly';   // Annual billing

/**
 * Plan status
 */
export type PlanStatus = 
  | 'active'      // Available for new subscriptions
  | 'deprecated'  // No new subscriptions, existing continue
  | 'retired';    // Completely unavailable

/**
 * Plan tier (conceptual level)
 */
export type PlanTier = 
  | 'free'        // Free tier
  | 'starter'     // Entry-level paid
  | 'basic'       // Basic paid
  | 'standard'    // Standard paid
  | 'pro'         // Professional
  | 'business'    // Business
  | 'enterprise'  // Enterprise
  | 'custom';     // Custom/negotiated

/**
 * Plan quota - numeric limits
 */
export interface PlanQuotaDto {
  key: string;
  name: string;
  limit: number;  // -1 for unlimited
  unit: string;
  resetsEachPeriod: boolean;
}

/**
 * Plan feature - boolean flags
 */
export interface PlanFeatureDto {
  key: string;
  name: string;
  included: boolean;
  description?: string;
}

/**
 * Plan DTO
 */
export interface PlanDto extends
  IHasUUID,
  IHasTitleAndDescription,
  IHasStatus<PlanStatus>,
  IHasTimestamps,
  IHasMetadata,
  IHasExternalId {
  
  /**
   * Reference to the parent Service
   */
  serviceId: string;

  /**
   * URL-friendly slug (unique within service)
   */
  slug: string;

  /**
   * Display name (alias for title from IHasTitleAndDescription)
   */
  name: string;

  /**
   * Conceptual tier
   */
  tier: PlanTier;

  /**
   * Price in cents (smallest currency unit)
   */
  priceCents: number;

  /**
   * Currency (ISO 4217)
   */
  currency: string;

  /**
   * Billing interval
   */
  interval: BillingInterval;

  /**
   * Interval count (e.g., 1 = every month, 3 = every 3 months)
   */
  intervalCount: number;

  /**
   * Trial period in days (0 = no trial)
   */
  trialDays: number;

  /**
   * Quotas (numeric limits)
   */
  quotas: PlanQuotaDto[];

  /**
   * Features (boolean flags)
   */
  features: PlanFeatureDto[];

  /**
   * Is this the "recommended" or "popular" plan?
   */
  isPopular: boolean;

  /**
   * Sort order for display
   */
  sortOrder: number;

  /**
   * External ID from payment provider (e.g., Stripe Price ID)
   * Note: Also available via IHasExternalId.externalId
   */
  externalPriceId?: string;
}

/**
 * Plan summary (for pricing tables)
 */
export interface PlanSummaryDto {
  id: string;
  slug: string;
  name: string;
  description: string;
  tier: PlanTier;
  priceCents: number;
  currency: string;
  interval: BillingInterval;
  isPopular: boolean;
  quotas: PlanQuotaDto[];
  features: PlanFeatureDto[];
}

/**
 * Helper: Format plan price
 */
export function formatPlanPrice(plan: PlanDto | PlanSummaryDto): string {
  if (plan.priceCents === 0) {
    return 'Free';
  }
  
  const amount = (plan.priceCents / 100).toFixed(2);
  const symbol = getCurrencySymbol(plan.currency);
  const interval = getIntervalLabel(plan.interval);
  
  return `${symbol}${amount}/${interval}`;
}

/**
 * Helper: Get currency symbol
 */
export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'AUD': 'A$',
    'CAD': 'C$',
    'NZD': 'NZ$',
    'JPY': '¥'
  };
  return symbols[currency.toUpperCase()] || currency;
}

/**
 * Helper: Get interval label
 */
export function getIntervalLabel(interval: BillingInterval): string {
  const labels: Record<BillingInterval, string> = {
    'once': 'one-time',
    'daily': 'day',
    'weekly': 'week',
    'monthly': 'month',
    'quarterly': 'quarter',
    'yearly': 'year'
  };
  return labels[interval] || interval;
}

/**
 * Helper: Get tier badge color
 */
export function getTierBadgeClass(tier: PlanTier): string {
  const classes: Record<PlanTier, string> = {
    'free': 'bg-secondary',
    'starter': 'bg-info',
    'basic': 'bg-primary',
    'standard': 'bg-primary',
    'pro': 'bg-success',
    'business': 'bg-warning',
    'enterprise': 'bg-danger',
    'custom': 'bg-dark'
  };
  return classes[tier] || 'bg-secondary';
}
