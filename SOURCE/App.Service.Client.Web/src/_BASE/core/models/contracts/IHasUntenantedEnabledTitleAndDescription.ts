import { IHasEnabled } from "./IHasEnabled";
import { IHasTenantedEnabledTitleAndDescription } from "./IHasTenantedEnabledTitleAndDescription";
import { IHasTitleAndDescription } from "./IHasTitleAndDescription";
import { IHasUUID } from "./IHasUUID";

export interface IHasUntenantedEnabledTitleAndDescription
  extends IHasUUID, IHasEnabled, IHasTitleAndDescription {
}

