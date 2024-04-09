import { IHasUUID } from "./IHasUUID";
import { IHasTitleAndDescription } from "./IHasTitleAndDescription";
import { IHasEnabled } from "./IHasEnabled";
import { IHasFromToUtc } from "./IHasFromToUtc";

/** Contract for simple, ReferenceData items.
 * Implements
 * IHasUUID,
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

export interface IHasUntenantedReferenceData
  extends
  IHasUUID,
  IHasEnabled,
  IHasFromToUtc,
  IHasTitleAndDescription {
}
