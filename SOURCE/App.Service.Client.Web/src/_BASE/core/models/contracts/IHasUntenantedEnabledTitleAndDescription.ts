import { IHasEnabled } from "./IHasEnabled";
import { IHasTitleAndDescription } from "./IHasTitleAndDescription";
import { IHasUUID } from "./IHasUUID";

/**
 * Contract.
 * 
 * implements:
 * IHasUUID,
 * IHasEnabled
 * IHasTitleAndDescription
 */
export interface IHasUntenantedEnabledTitleAndDescription
  extends
  IHasUUID,
  IHasEnabled,
  IHasTitleAndDescription {
}

