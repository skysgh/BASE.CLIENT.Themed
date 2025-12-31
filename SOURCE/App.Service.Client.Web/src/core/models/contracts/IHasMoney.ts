/**
 * Contract for models that have currency and amount fields.
 * 
 * Used for any entity that deals with money:
 * - Subscriptions, Orders, Transactions, Plans
 * 
 * IMPORTANT:
 * - Always store amounts in smallest currency unit (cents)
 * - This avoids floating point precision issues
 * - Display formatting should convert: amountCents / 100
 * 
 * See also:
 * - IHasPrice for simpler price-only scenarios
 * - IHasRate for rate/interval patterns
 */
export interface IHasMoney {
  /**
   * Amount in smallest currency unit (e.g., cents for USD).
   * Use integer to avoid floating point precision issues.
   */
  amountCents: number;

  /**
   * ISO 4217 currency code (e.g., "USD", "EUR", "GBP").
   */
  currency: string;
}
