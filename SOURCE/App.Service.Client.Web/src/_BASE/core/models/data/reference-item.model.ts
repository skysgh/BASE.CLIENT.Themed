import { HasTitleAndDescriptionBase } from "../base/HasTitleAndDescriptionBase";
import { IHasReferenceData } from "../contracts/IHasReferenceData";

import { IHasUUID } from "../contracts/IHasUUID";

// A Generic item in a REference Data list
// suitable for dropdowns.
// Note that Service should return list in the
// order desired displayed (ie ,that MRU items)
// were put at top, before padding with remainder.
export class ReferenceData
  extends HasTitleAndDescriptionBase
  implements IHasUUID, IHasReferenceData {
  public id?: any;
}



