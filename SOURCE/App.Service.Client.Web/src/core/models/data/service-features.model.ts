
import { HasUntenantedReferenceDataBase } from "../base/HasUntenantedReferenceDataBase";
import { IHasServiceId } from "../contracts/IHasServiceId";

/** Data Class to describe features a service
 * has. It is distint (generally a superset)
 * of what is expressed within
 * servicePricingPlanFeatures
 *
 * implements:
 * IHasServiceId
 * IHasUUID
 * IHasEnabled
 * TODO: add IHasValidFromToUtc
 * IHasTitleAndDescription
 */

export class ServiceFeature
  extends HasUntenantedReferenceDataBase
  implements IHasServiceId {

  serviceId!: string;
}
