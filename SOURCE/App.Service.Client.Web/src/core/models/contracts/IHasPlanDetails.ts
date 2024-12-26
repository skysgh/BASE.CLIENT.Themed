

/**
 * 
 */
export interface IHasPlanDetails {

  /** Users who create, contribute, review,
   * approve, manage Resources. Excludes Consumes)
   */
  members: number;

  ///**
  // * Number of partners is hard to define
  // * for small/medium teams because they
  // * may not be bothering with an org AAD,
  // * just relying on consumer IdPs. In which
  // * case there is no 'outside' as there is no 'inside'.
  // */
  //@deprecate
  //partners: number;

  /** Number of groups they can develop.*/
  groups: number;
  /** Number of projects they can manage. */
  projects: number;
  /** Number of products they can develop. */
  products: number;

}
