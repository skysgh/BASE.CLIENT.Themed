import { IHasUUID } from "../contracts/IHasUUID";


/**
 * All database records have an identifier.
 * The Id must be UUID based (not integer based)
 * to enabled scaling across multiple devices.
 *
 * IMplements IHasUUID
 */
export abstract class HasUUIDEntityBase implements IHasUUID {

  /** UUID based
  * Identifier
  */
  public id!: string;
}
