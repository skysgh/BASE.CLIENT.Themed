import { IHasUUID } from "../../../core/models/contracts/IHasUUID";
import { IHasTitleAndDescription} from "../../../core/models/contracts/IHasTitleAndDescription";
import { HasTitleAndDescriptionBase } from "../../../core/models/base/HasTitleAndDescriptionBase";

export class Value extends HasTitleAndDescriptionBase implements IHasUUID, IHasTitleAndDescription{
  public id?: string;

}
