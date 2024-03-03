import { IHasUUID } from "../../../shared/models/contracts/IHasUUID";
import { IHasTitleAndDescription} from "../../../shared/models/contracts/IHasTitleAndDescription";
import { HasTitleAndDescriptionBase } from "../../../shared/models/base/HasTitleAndDescription";

export class Value extends HasTitleAndDescriptionBase implements IHasUUID, IHasTitleAndDescription{
  public id?: string;

}
