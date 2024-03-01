import { IHasUUID } from "../../../common/contracts/IHasUUID";
import { IHasTitleAndDescription} from "../../../common/contracts/IHasTitleAndDescription";

export class Value implements IHasUUID, IHasTitleAndDescription{
  public id?: string;

  public title?: string;

  public description?: string;
}
