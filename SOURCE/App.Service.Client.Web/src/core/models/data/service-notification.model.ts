import { HasTenantedEnabledTitleAndDescriptionBase } from "../base/HasTenantedEnabledTitleAndDescriptionBase";
import { IHasBinaryState } from "../contracts/IHasBinaryState";
import { IHasEnabled } from "../contracts/IHasEnabled";
import { IHasImageId } from "../contracts/IHasImageId";
import { IHasTitleAndDescription } from "../contracts/IHasTitleAndDescription";
import { IHasTypeFK } from "../contracts/IHasTypeFK";
import { IHasUUID } from "../contracts/IHasUUID";

export class ServiceNotification
  extends HasTenantedEnabledTitleAndDescriptionBase
  implements IHasUUID, IHasEnabled, IHasTypeFK, IHasBinaryState, IHasImageId, IHasTitleAndDescription {
  // has id, title, description

  public typeFK: any; //ref of MessageType

  public state: boolean = true;

  /**
   * Foreign Key to the sender user's FK.
   */
  public senderFK: any;
  /**
   * Foreign Key to the recipient user's FK.
   */
  public receiverFK: any;
  /**
   * TODO: consider that over time more icon libs may
   * be added, requiring multiple iconLibs.
   */
  public imageId: string = "";

}
