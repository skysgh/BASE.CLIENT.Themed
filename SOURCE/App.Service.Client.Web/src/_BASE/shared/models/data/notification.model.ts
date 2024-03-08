import { ReferenceDataBase } from "./base/ReferenceDataBase";

/***
 * Model for Notifications
 * rendered at least in the layout frame's topbar.
 */
export class Notification extends ReferenceDataBase {
  // has id, title, description
  public typeFK: any; //ref of NotificationType
  /**
   * Foreign Key to the sender user's FK.
   */
  public senderFK: any;
  /**
   * Foreign Key to the recipient user's FK.
   */
  public receiverFK: any;
  /**
   * The name of the class for rendering an icon beside
   * the message.
   */
  public iconLibId?: string;
  /**
   * TODO: consider that over time more icon libs may
   * be added, requiring multiple iconLibs.
   */
  public iconClassId?: string;
  /**
   * The name of the class for rendering an icon beside
   * the message.
   */
  public userImageId?: string;
}
