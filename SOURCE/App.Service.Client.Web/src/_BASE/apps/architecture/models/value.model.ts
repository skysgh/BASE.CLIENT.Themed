import { IHasUUID } from "../../../core/models/contracts/IHasUUID";
import { IHasTitleAndDescription} from "../../../core/models/contracts/IHasTitleAndDescription";
import { HasTenantedTitleAndDescriptionBase } from "../../../core/models/base/HasTenantedTitleAndDescriptionBase";

export class Value extends HasTenantedTitleAndDescriptionBase implements IHasUUID, IHasTitleAndDescription{
  public id?: string;

}
