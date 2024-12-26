/**
 * Contract for child items to reference
 * parent entities.
 *
 * An example would be line items of an invoice.
 */
export interface IHasParentFK  {

  /**
   * FK to parent entity's UUID id.
   */
  ParentFK? : string
}
