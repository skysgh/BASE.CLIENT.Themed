/**
 * Order DTO
 * 
 * An Order is a ONE-TIME PURCHASE by an Account.
 * 
 * Implements:
 * - IHasUUID: Has id field
 * - IHasStatus: Has status field
 * - IHasTimestamps: Has createdUtc/modifiedUtc
 * - IHasMetadata: Has flexible key-value pairs
 * - IHasExternalId: Links to payment provider (Stripe PaymentIntent ID)
 */
import { IHasUUID } from '../../../core/models/contracts/IHasUUID';
import { IHasStatus } from '../../../core/models/contracts/IHasStatus';
import { IHasTimestamps } from '../../../core/models/contracts/IHasTimestamps';
import { IHasMetadata } from '../../../core/models/contracts/IHasMetadata';
import { IHasExternalId } from '../../../core/models/contracts/IHasExternalId';

/**
 * Order status
 */
export type OrderStatus = 
  | 'pending'         // Order created, awaiting payment
  | 'processing'      // Payment received, preparing order
  | 'completed'       // Order fulfilled
  | 'shipped'         // Physical goods shipped
  | 'delivered'       // Physical goods delivered
  | 'cancelled'       // Order cancelled
  | 'refunded'        // Order refunded
  | 'failed';         // Payment or fulfillment failed

/**
 * Order type
 */
export type OrderType = 
  | 'product'         // Physical or digital product
  | 'service'         // One-time service
  | 'credit'          // Account credit purchase
  | 'addon'           // Add-on to subscription
  | 'upgrade';        // One-time upgrade fee

/**
 * Order line item
 */
export interface OrderItemDto {
  id: string;
  productId: string;
  productName: string;
  description?: string;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
  discountCents?: number;
  taxCents?: number;
  sku?: string;
  imageUrl?: string;
  metadata?: Record<string, string>;
}

/**
 * Order DTO
 */
export interface OrderDto extends
  IHasUUID,
  IHasStatus<OrderStatus>,
  IHasTimestamps,
  IHasMetadata,
  IHasExternalId {
  
  /**
   * Order number (human-readable, e.g., "ORD-2024-001234")
   */
  orderNumber: string;

  /**
   * Reference to the BillingAccount (who pays)
   * KEY: Accounts order, not people
   */
  accountId: string;

  /**
   * Order type
   */
  type: OrderType;

  // ============================================
  // Line Items
  // ============================================

  items: OrderItemDto[];

  // ============================================
  // Totals (in cents to avoid floating point issues)
  // ============================================

  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  shippingCents: number;
  totalCents: number;
  currency: string;

  // ============================================
  // Payment
  // ============================================

  paymentMethodId?: string;
  paymentMethodLast4?: string;
  paidAt?: string;
  externalPaymentId?: string;

  // ============================================
  // Shipping (for physical goods)
  // ============================================

  shippingAddress?: ShippingAddressDto;
  trackingNumber?: string;
  carrier?: string;
  shippedAt?: string;
  deliveredAt?: string;

  // ============================================
  // Discount/Promo
  // ============================================

  promoCode?: string;
  promoDescription?: string;

  // ============================================
  // Notes
  // ============================================

  customerNotes?: string;
  internalNotes?: string;

  // ============================================
  // Refund
  // ============================================

  refundedAt?: string;
  refundAmountCents?: number;
  refundReason?: string;
}

/**
 * Shipping address
 */
export interface ShippingAddressDto {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
}

/**
 * Create order request (from cart)
 */
export interface CreateOrderRequest {
  accountId: string;
  items: CreateOrderItemRequest[];
  paymentMethodId: string;
  shippingAddress?: ShippingAddressDto;
  promoCode?: string;
  customerNotes?: string;
}

/**
 * Create order item request
 */
export interface CreateOrderItemRequest {
  productId: string;
  quantity: number;
  sku?: string;
}

/**
 * Order summary (for listings)
 */
export interface OrderSummaryDto {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalCents: number;
  currency: string;
  itemCount: number;
  createdUtc: string;
}

/**
 * Helper: Get order status badge class
 */
export function getOrderStatusBadgeClass(status: OrderStatus): string {
  const classes: Record<OrderStatus, string> = {
    'pending': 'bg-warning-subtle text-warning',
    'processing': 'bg-info-subtle text-info',
    'completed': 'bg-success-subtle text-success',
    'shipped': 'bg-primary-subtle text-primary',
    'delivered': 'bg-success-subtle text-success',
    'cancelled': 'bg-secondary-subtle text-secondary',
    'refunded': 'bg-danger-subtle text-danger',
    'failed': 'bg-danger-subtle text-danger'
  };
  return classes[status] || 'bg-secondary-subtle text-secondary';
}

/**
 * Helper: Get order status display text
 */
export function getOrderStatusText(status: OrderStatus): string {
  const texts: Record<OrderStatus, string> = {
    'pending': 'Pending Payment',
    'processing': 'Processing',
    'completed': 'Completed',
    'shipped': 'Shipped',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled',
    'refunded': 'Refunded',
    'failed': 'Failed'
  };
  return texts[status] || status;
}

/**
 * Helper: Can order be cancelled?
 */
export function canCancelOrder(status: OrderStatus): boolean {
  return status === 'pending' || status === 'processing';
}

/**
 * Helper: Can order be refunded?
 */
export function canRefundOrder(status: OrderStatus): boolean {
  return status === 'completed' || status === 'shipped' || status === 'delivered';
}
