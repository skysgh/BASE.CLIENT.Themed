/**
 * Transaction DTO
 * 
 * Represents a payment transaction (completed, pending, or failed).
 * Used for payment history and receipts.
 */

/**
 * Transaction types
 */
export type TransactionType = 'subscription' | 'purchase' | 'refund' | 'adjustment';

/**
 * Transaction status
 */
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';

/**
 * Transaction DTO
 */
export interface TransactionDto {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Type of transaction
   */
  type: TransactionType;

  /**
   * Transaction status
   */
  status: TransactionStatus;

  /**
   * Amount in cents (to avoid floating point issues)
   */
  amountCents: number;

  /**
   * Currency code (ISO 4217)
   */
  currency: string;

  /**
   * Description of the transaction
   */
  description: string;

  /**
   * Reference to subscription (if subscription payment)
   */
  subscriptionId?: string;

  /**
   * Reference to order (if purchase)
   */
  orderId?: string;

  /**
   * Payment method ID used
   */
  paymentMethodId?: string;

  /**
   * Last 4 digits of payment method (for display)
   */
  paymentMethodLast4?: string;

  /**
   * External transaction ID from payment provider
   */
  externalId?: string;

  /**
   * Error message (if failed)
   */
  errorMessage?: string;

  /**
   * Invoice ID (if invoice was generated)
   */
  invoiceId?: string;

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
 * Helper to format amount from cents to display string
 */
export function formatAmount(amountCents: number, currency: string = 'USD'): string {
  const amount = amountCents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

/**
 * Helper to get status badge class
 */
export function getStatusBadgeClass(status: TransactionStatus): string {
  const classes: Record<TransactionStatus, string> = {
    'pending': 'bg-warning-subtle text-warning',
    'processing': 'bg-info-subtle text-info',
    'completed': 'bg-success-subtle text-success',
    'failed': 'bg-danger-subtle text-danger',
    'cancelled': 'bg-secondary-subtle text-secondary',
    'refunded': 'bg-primary-subtle text-primary'
  };
  return classes[status] || 'bg-secondary-subtle text-secondary';
}
