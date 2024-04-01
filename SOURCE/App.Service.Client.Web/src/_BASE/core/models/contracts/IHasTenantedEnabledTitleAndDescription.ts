import { IHasEnabled } from "./IHasEnabled";
import { IHasUntenantedEnabledTitleAndDescription } from "./IHasUntenantedEnabledTitleAndDescription";
import { IHasTenancyId } from "./IHasTenancyId";
import { IHasTitleAndDescription } from "./IHasTitleAndDescription";
import { IHasUntenantedReferenceData } from "./IHasUntenantedReferenceData";



export interface IHasTenantedEnabledTitleAndDescription
  extends IHasTenancyId,
  IHasUntenantedEnabledTitleAndDescription {
}
