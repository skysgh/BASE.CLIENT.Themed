import { IHasUUID } from "../../../core/models/contracts/IHasUUID";
import { IHasTitleAndDescription} from "../../../core/models/contracts/IHasTitleAndDescription";
import { HasTenantedEnabledTitleAndDescriptionBase  } from "../../../core/models/base/HasTenantedEnabledTitleAndDescriptionBase";

export class Value extends HasTenantedEnabledTitleAndDescriptionBase implements IHasUUID, IHasTitleAndDescription{

  public id?: string;

}
