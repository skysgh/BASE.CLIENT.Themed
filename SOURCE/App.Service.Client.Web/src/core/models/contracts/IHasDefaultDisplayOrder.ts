/** Contract for defining a default Display Order
 * of sets of data.
 *
 * WARNING:
 * It's generally considered questionable design
 * to embed display layer concern, such
 * as displayOrder or imageId,
 * in a datastore layer. But also common.
 * What's definately more suspect is mixing
 * concerns in the same entity, rather than
 * a separate descriptor object.
 * 
 */
export interface IHasDefaultDisplayOrder {
  /** The default ordering of the item
   * in a list, if no more available information
   * (such as an MRU object).
   */
    defaultDisplayOrder: number;
}
