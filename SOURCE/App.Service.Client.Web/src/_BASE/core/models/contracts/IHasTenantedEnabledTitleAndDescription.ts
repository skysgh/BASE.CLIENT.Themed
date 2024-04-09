import { IHasUntenantedEnabledTitleAndDescription } from "./IHasUntenantedEnabledTitleAndDescription";
import { IHasTenancyId } from "./IHasTenancyId";


/**
 * Implements
 * 
 * IHasTenancyId,
 * IHasUUID,
 * IHasEnabled,
 * IHasTitleAndDescription
 */
export interface IHasTenantedEnabledTitleAndDescription
  extends
  IHasTenancyId,
  IHasUntenantedEnabledTitleAndDescription
{
}

