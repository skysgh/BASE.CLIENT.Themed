import { IHasEnabled } from "../contracts/IHasEnabled";
import { IHasImageId } from "../contracts/IHasImageId";
import { IHasTitleAndDescription } from "../contracts/IHasTitleAndDescription";
import { IHasTypeFK } from "../contracts/IHasTypeFK";
import { IHasUUID } from "../contracts/IHasUUID";
import { ReferenceDataBase } from "./base/ReferenceDataBase";

/***
 * Model for Notifications
 * rendered at least in the layout frame's topbar.
 */
export class Message
  extends ReferenceDataBase
  implements IHasUUID,IHasEnabled, IHasTypeFK, IHasImageId, IHasTitleAndDescription {
  // has id, title, description

  public typeFK: any; //ref of MessageType
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
