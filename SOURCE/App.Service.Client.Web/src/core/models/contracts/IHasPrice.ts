/**
 * Price (see IHasRate)
 */
export interface IHasPrice {

  /**
   * Single instance
   * Purchase Price.
   * 
   * Note:
   * In a SaaS, this would not 
   * be applied to a Plan, but could
   * be applied to Products sold within
   * the service.
   */
  price: number;
}
