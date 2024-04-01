import { IHasEnabled } from "./IHasEnabled";
import { IHasFromToUtc } from "./IHasFromToUtc";
import { IHasTenancyId } from "./IHasTenancyId";
import { IHasTitleAndDescription } from "./IHasTitleAndDescription";
import { IHasUUID } from "./IHasUUID";
import { IHasUntenantedReferenceData } from "./IHasUntenantedReferenceData";

/** Contract for simple, ReferenceData items.
 * Implements IHasUUID, IHasTenancyId, IHasEnabled, and IHasTitleAndDescription.
 *
 * Note:
 * (see IHasEnabledReferenceData).
 *
 * Todo:
 * Not sure that it makes much sense to not have enabled attached
 * right from the start.
 *
 * Todo:
 * Have to implement IHasTenancy,
 * or makes something else, eg: IHasTenantedReferenceData.
 */

export interface IHasTenantedReferenceData
  extends 
  IHasUUID,
  IHasTenancyId,
  IHasEnabled,
  IHasFromToUtc,
  IHasTitleAndDescription {
}
