import { IHasDefaultDisplayOrder } from "./IHasDefaultDisplayOrder";
import { IHasNew } from "./IHasNew";

/** Contract to describe the
 * display characteristics
 * of an IHasReferenceData derived entity
 */
export interface IHasReferenceDataDisplayAttributes
  extends IHasDefaultDisplayOrder,
  IHasNew {
}
