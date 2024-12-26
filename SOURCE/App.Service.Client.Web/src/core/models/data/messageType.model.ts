import { HasTenantedReferenceDataBase } from "../base/HasTenantedReferenceDataBase";
import { IHasEnabled } from "../contracts/IHasEnabled";

/**
 * Type of Notification.
 * Examples might include [User]Message, [system]Alert
 * for example. 
 */
export class MessageType extends HasTenantedReferenceDataBase
{
  // has id, title, description
}
