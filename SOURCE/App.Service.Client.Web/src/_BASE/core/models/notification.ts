import { HasTenantedTitleAndDescriptionBase } from "./base/HasTenantedTitleAndDescriptionBase";
import { IHasUUID } from "./contracts/IHasUUID";


export class Notification extends HasTenantedTitleAndDescriptionBase implements IHasUUID {

  public id: any;
}
