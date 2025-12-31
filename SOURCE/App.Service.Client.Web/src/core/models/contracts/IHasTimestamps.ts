/**
 * Contract for models that have audit timestamps.
 * 
 * Used for tracking when entities were created and last modified.
 * These should be UTC timestamps (ISO 8601 strings or Date objects).
 * 
 * IMPORTANT:
 * - Always use UTC for storage and transmission
 * - Convert to local time only for display
 * - createdUtc should never change after initial creation
 * - modifiedUtc should update on every change
 * 
 * See also:
 * - IHasFromToUtc for validity/expiry dates
 * - IHasEnabled for soft-delete patterns
 */
export interface IHasTimestamps {
  /**
   * When the entity was created (UTC).
   * Should be set once on creation and never modified.
   */
  createdUtc: string;

  /**
   * When the entity was last modified (UTC).
   * Should update on every change.
   */
  modifiedUtc: string;
}
