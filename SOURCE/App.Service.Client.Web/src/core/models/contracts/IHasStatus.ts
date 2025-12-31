/**
 * Contract for models that have a status field.
 * 
 * Used for entities with lifecycle states (active, suspended, etc.)
 * The TStatus type parameter allows type-safe status values.
 * 
 * See also:
 * - IHasEnabled for simple binary on/off
 * - IHasFromToUtc for time-based validity
 */
export interface IHasStatus<TStatus extends string> {
  /**
   * Current status of the entity.
   */
  status: TStatus;
}
