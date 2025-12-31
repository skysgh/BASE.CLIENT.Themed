/**
 * Billing Account DTO
 * 
 * An Account is a GROUP entity for billing and administration purposes.
 * 
 * Implements:
 * - IHasUUID: Has id field
 * - IHasTitleAndDescription: Has title (name) and description
 * - IHasStatus: Has status field
 * - IHasTimestamps: Has createdUtc/modifiedUtc
 * - IHasMetadata: Has flexible key-value pairs
 * - IHasExternalId: Links to external payment provider (Stripe Customer ID)
 */
import { IHasUUID } from '../../../core/models/contracts/IHasUUID';
import { IHasStatus } from '../../../core/models/contracts/IHasStatus';
import { IHasTimestamps } from '../../../core/models/contracts/IHasTimestamps';
import { IHasMetadata } from '../../../core/models/contracts/IHasMetadata';
import { IHasExternalId } from '../../../core/models/contracts/IHasExternalId';

/**
 * Account status
 */
export type BillingAccountStatus = 
  | 'active'      // Normal operating state
  | 'suspended'   // Temporarily suspended (e.g., payment issues)
  | 'closed'      // Permanently closed
  | 'pending';    // Awaiting activation

/**
 * Account type - helps with tax, compliance, and features
 */
export type BillingAccountType = 
  | 'individual'    // Single person
  | 'family'        // Household/family group
  | 'business'      // Company/organization
  | 'educational'   // School, university
  | 'nonprofit'     // Charity, NGO
  | 'government';   // Government entity

/**
 * Billing Account DTO
 * 
 * Implements core contracts for consistency with other entities.
 */
export interface BillingAccountDto extends 
  IHasUUID,
  IHasStatus<BillingAccountStatus>,
  IHasTimestamps,
  IHasMetadata,
  IHasExternalId {
  
  /**
   * Display name for the account (serves as "title")
   * Examples: "Smith Family", "Acme Corp", "John Doe"
   */
  name: string;

  /**
   * Account type
   */
  type: BillingAccountType;

  /**
   * Primary email for billing notifications
   */
  billingEmail: string;

  /**
   * Billing address
   */
  billingAddress?: BillingAddressDto;

  /**
   * Tax ID (for business accounts)
   */
  taxId?: string;

  /**
   * Default currency for billing (ISO 4217)
   */
  currency: string;

  /**
   * Default payment method ID (reference to PaymentMethod)
   */
  defaultPaymentMethodId?: string;

  /**
   * External ID from payment provider (e.g., Stripe Customer ID)
   * Note: Also available via IHasExternalId.externalId
   * This alias is for clarity: externalCustomerId specifically means payment provider
   */
  externalCustomerId?: string;
}

/**
 * Billing address (reused from payment-method.dto.ts)
 */
export interface BillingAddressDto {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

/**
 * Create billing account request
 */
export interface CreateBillingAccountRequest {
  name: string;
  type: BillingAccountType;
  billingEmail: string;
  billingAddress?: BillingAddressDto;
  taxId?: string;
  currency?: string;  // Defaults to USD
}

/**
 * Update billing account request
 */
export interface UpdateBillingAccountRequest {
  name?: string;
  billingEmail?: string;
  billingAddress?: BillingAddressDto;
  taxId?: string;
  defaultPaymentMethodId?: string;
}
