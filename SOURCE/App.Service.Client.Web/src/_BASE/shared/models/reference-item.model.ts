import { IHasReferenceData } from  "./contracts/IHasReferenceData";
import { HasTitleAndDescriptionBase } from "./base/HasTitleAndDescription";

// A Generic item in a REference Data list
// suitable for dropdowns.
// Note that Service should return list in the
// order desired displayed (ie ,that MRU items)
// were put at top, before padding with remainder.
export class ReferenceData extends HasTitleAndDescriptionBase implements IHasReferenceData {
  public id?: any;
}



