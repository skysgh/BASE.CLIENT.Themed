/**
 * Payment Method DTO
 * 
 * Represents a saved payment method (credit card, bank account, etc.)
 * Used for both subscription and transaction payments.
 */

/**
 * Payment method types
 */
export type PaymentMethodType = 'credit_card' | 'debit_card' | 'bank_account' | 'paypal' | 'other';

/**
 * Card brand types
 */
export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'diners' | 'jcb' | 'unionpay' | 'unknown';

/**
 * Payment method DTO
 */
export interface PaymentMethodDto {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Type of payment method
   */
  type: PaymentMethodType;

  /**
   * Card brand (for card types)
   */
  brand?: CardBrand;

  /**
   * Last 4 digits of card number (masked)
   */
  last4: string;

  /**
   * Expiration month (1-12)
   */
  expiryMonth?: number;

  /**
   * Expiration year (4 digit)
   */
  expiryYear?: number;

  /**
   * Cardholder or account holder name
   */
  holderName: string;

  /**
   * Whether this is the default payment method
   */
  isDefault: boolean;

  /**
   * Billing address (optional)
   */
  billingAddress?: BillingAddressDto;

  /**
   * External payment provider ID (e.g., Stripe payment method ID)
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
 * Billing address for payment methods
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
 * Create payment method request
 * Used when adding a new card
 */
export interface CreatePaymentMethodRequest {
  type: PaymentMethodType;
  cardNumber?: string;       // Full card number (only sent once, never stored)
  expiryMonth?: number;
  expiryYear?: number;
  cvv?: string;              // CVV (only sent once, never stored)
  holderName: string;
  isDefault?: boolean;
  billingAddress?: BillingAddressDto;
}

/**
 * Helper to get card brand icon class
 */
export function getCardBrandIcon(brand: CardBrand): string {
  const icons: Record<CardBrand, string> = {
    'visa': 'ri-visa-fill',
    'mastercard': 'ri-mastercard-fill',
    'amex': 'bx bxl-visa',  // No specific amex icon
    'discover': 'bx bxs-credit-card',
    'diners': 'bx bxs-credit-card',
    'jcb': 'bx bxs-credit-card',
    'unionpay': 'bx bxs-credit-card',
    'unknown': 'bx bxs-credit-card'
  };
  return icons[brand] || icons['unknown'];
}

/**
 * Helper to format expiry date
 */
export function formatExpiry(month: number, year: number): string {
  const m = month.toString().padStart(2, '0');
  const y = year.toString().slice(-2);
  return `${m}/${y}`;
}
