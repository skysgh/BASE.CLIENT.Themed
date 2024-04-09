
/** Contract for a entity that has a value property.
 *
 * See IHasGenericKeyValue<TValue>, etc.
 * 
 */
export interface IHasGenericValue<TValue> {

  /** Primary value of the entity.
   *
   * WARNING:
   * Using a value property is often
   * only really good value in simple apps
   * when instead the use of a join object
   * provides a more appropriate modelling.
   */
  value: TValue;
}

