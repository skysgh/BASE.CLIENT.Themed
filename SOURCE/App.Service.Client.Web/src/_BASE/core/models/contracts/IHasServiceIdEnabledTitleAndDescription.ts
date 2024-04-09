import { IHasEnabled } from "./IHasEnabled";
import { IHasServiceId } from "./IHasServiceId";
import { IHasTitleAndDescription } from "./IHasTitleAndDescription";
import { IHasUUID } from "./IHasUUID";
import { IHasUntenantedEnabledTitleAndDescription } from "./IHasUntenantedEnabledTitleAndDescription";


/**
 * Implements:
 * IHasServiceId,
 * IHasUUID
 * IHasEnabled
 * IHasTitleAndDescription
 */
export interface IHasServiceIdEnabledTitleAndDescription
  extends
  IHasServiceId,
  IHasUntenantedEnabledTitleAndDescription {

}
