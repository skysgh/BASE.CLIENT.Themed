import { IHasTenancyId } from "./IHasTenancyId";
import { IHasUntenantedReferenceData } from "./IHasUntenantedReferenceData";

/** Contract for simple, ReferenceData items.
 * Implements:
 * IHasUUID,
 * IHasTenancyId,
 * IHasEnabled,
 * IHasFromToUtc,
 * IHasTitleAndDescription.
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
  IHasTenancyId,
  IHasUntenantedReferenceData {
}


