import { IHasEnabled } from "../contracts/IHasEnabled";
import { IHasImageId } from "../contracts/IHasImageId";
import { IHasServiceId } from "../contracts/IHasServiceId";
import { IHasTitleAndDescription } from "../contracts/IHasTitleAndDescription";
import { IHasUUID } from "../contracts/IHasUUID";

export class ServiceCapability
  implements IHasServiceId, IHasUUID, IHasEnabled, IHasImageId, IHasTitleAndDescription {

  serviceId!: string;
  id?: string | undefined;
  enabled: boolean = true;
  title!: string;
  description!: string;
  imageId?: string | undefined;

}
