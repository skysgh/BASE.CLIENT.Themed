import { IHasUUID } from "../../shared/models/contracts/IHasUUID";
import { HasTitleAndDescriptionBase } from "../../shared/models/base/HasTitleAndDescriptionBase";


export class Notification extends HasTitleAndDescriptionBase implements IHasUUID {

  public id: any;
}
