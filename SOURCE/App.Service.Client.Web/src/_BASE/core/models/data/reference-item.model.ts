import { HasTenantedTitleAndDescriptionBase } from "../base/HasTenantedTitleAndDescriptionBase";
import { IHasTenantedReferenceData } from "../contracts/IHasTenantedReferenceData";

import { IHasUUID } from "../contracts/IHasUUID";

// A Generic item in a REference Data list
// suitable for dropdowns.
// Note that Service should return list in the
// order desired displayed (ie ,that MRU items)
// were put at top, before padding with remainder.
export class TenanReferenceData
  extends HasTenantedTitleAndDescriptionBase
  implements IHasUUID, IHasTenantedReferenceData {
  public id?: any;
}



