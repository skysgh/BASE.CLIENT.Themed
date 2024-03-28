import { HasTitleAndDescriptionBase } from "./base/HasTitleAndDescriptionBase";
import { IHasUUID } from "./contracts/IHasUUID";


export class Notification extends HasTitleAndDescriptionBase implements IHasUUID {

  public id: any;
}
