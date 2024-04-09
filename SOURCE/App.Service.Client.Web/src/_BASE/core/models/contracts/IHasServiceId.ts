/** Contract for data record entities that
 * are specific to a single Service
 * (but shared across Tenancies associated
 * to this service)
 *
* It is intended that a System
* can hold more than one
* (currently expecting to be only a small number?)
* of services, which in turn
* can host multiple tenancies
* 
* See IHasTenancyId
 */
export interface IHasServiceId {
  /**
   * Id of individidual
   * Service on System.
   *
   * It is intended that a System
   * can hold more than one
   * (currently expecting to be only a small number?)
   * of services, which in turn
   * can host multiple tenancies
   */
  serviceId: string;
}
