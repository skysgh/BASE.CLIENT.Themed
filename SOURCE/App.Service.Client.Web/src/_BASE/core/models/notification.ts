import { IHasUUID } from "./contracts/IHasUUID";
import { HasTitleAndDescriptionBase } from "./models/base/HasTitleAndDescriptionBase";


export class Notification extends HasTitleAndDescriptionBase implements IHasUUID {

  public id: any;
}
