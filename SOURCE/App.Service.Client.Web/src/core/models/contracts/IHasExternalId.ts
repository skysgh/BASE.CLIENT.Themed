/**
 * Contract for models that reference an external system.
 * 
 * Used for entities that sync with external providers:
 * - Payment providers (Stripe, PayPal)
 * - Identity providers (Auth0, Okta)
 * - CRM systems, etc.
 * 
 * IMPORTANT:
 * - Store the external ID to enable reconciliation
 * - Never expose internal IDs to external systems
 * - Consider storing provider name if multiple providers
 * 
 * See also:
 * - IHasId for internal identifiers
 */
export interface IHasExternalId {
  /**
   * External system identifier.
   * Examples:
   * - Stripe: "cus_xxx", "sub_xxx", "pi_xxx"
   * - PayPal: "I-xxx"
   * - Auth0: "auth0|xxx"
   */
  externalId?: string;
}
