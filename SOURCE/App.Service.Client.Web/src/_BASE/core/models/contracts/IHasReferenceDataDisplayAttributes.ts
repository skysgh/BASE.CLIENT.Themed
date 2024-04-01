/** Contract to describe the
 * display characteristics
 * of an IHasReferenceData derived entity
 */
export interface IHasReferenceDataDisplayAttributes {

  /**
   * Before any per tenancy/per user MRU
   * ordering is applied, the natural order
   * of items 
   */
  displayOrder: number;

  /**
   * A flag that can be used to render
   * a newly introduced list item as
   * New/highlighted.
   */
  isNewUntil: Date;
}
