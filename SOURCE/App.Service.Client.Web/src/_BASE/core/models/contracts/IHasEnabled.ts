
/**
 * Contract for models that
 * require indicating whether the entry
 * is enabled or not.
 * Used for filtering by repositories.
 */
export interface IHasEnabled {
  /**
   * A state flag to indicate whether the
   * item (often a ReferenceData item)
   * is enabled.
   * 
   * Required.
   *
   * See aslo: IHasTenancyId as in a multi-tenancy
   * item, it is often the primary filter, with
   * enabled second.
   */
  enabled: boolean
}

