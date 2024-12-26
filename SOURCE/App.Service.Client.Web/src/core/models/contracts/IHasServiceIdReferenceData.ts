import { IHasEnabled } from "./IHasEnabled";
import { IHasFromToUtc } from "./IHasFromToUtc";
import { IHasServiceId } from "./IHasServiceId";
import { IHasTitleAndDescription } from "./IHasTitleAndDescription";
import { IHasUUID } from "./IHasUUID";
import { IHasUntenantedReferenceData } from "./IHasUntenantedReferenceData";



/**
 * Implements:
 *
 * IHasServiceId,
 * IHasUUID
 * IHasEnabled,
 * IHasFromToUtc,
 * IHasTitleAndDescription
 */
export interface IHasServiceIdReferenceData
    extends
  IHasServiceId,
  IHasUntenantedReferenceData {
}
