import { IHasEnabled } from "../contracts/IHasEnabled";
import { IHasImageId } from "../contracts/IHasImageId";
import { IHasServiceId } from "../contracts/IHasServiceId";
import { IHasTitleAndDescription } from "../contracts/IHasTitleAndDescription";
import { IHasUUID } from "../contracts/IHasUUID";

/** Model for a Datastore record
 * of a single feature of a Service.
 *
 * Used on sales pitch pages.
 */
export class ServicePricingPlanFeatures
  implements IHasServiceId, IHasUUID, IHasEnabled, IHasImageId, IHasTitleAndDescription {

  serviceId!: string;
  id?: string | undefined;
  enabled: boolean = true;
  title!: string;
  description!: string;
  imageId?: string | undefined;
}
