/**
 * Contract for models that have metadata (flexible key-value pairs).
 * 
 * Used for extensibility without schema changes:
 * - Custom fields per tenant
 * - Integration-specific data
 * - Feature flags
 * 
 * IMPORTANT:
 * - Keep keys short and consistent (use snake_case or camelCase)
 * - Don't store sensitive data in metadata
 * - Consider size limits for storage
 * 
 * See also:
 * - IHasStringKeyValue for required key-value
 */
export interface IHasMetadata {
  /**
   * Flexible key-value pairs for extensibility.
   * Values should be strings (serialize complex objects as JSON).
   */
  metadata?: Record<string, string>;
}
