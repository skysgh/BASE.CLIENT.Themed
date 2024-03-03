import { IHasReferenceData } from  "../../contracts/IHasReferenceData";
import { HasTitleAndDescription } from "./../HasTitleAndDescription";

// A Generic item in a REference Data list
// suitable for dropdowns.
// Note that Service should return list in the
// order desired displayed (ie ,that MRU items)
// were put at top, before padding with remainder.
export abstract class ReferenceDataBase extends HasTitleAndDescription implements IHasReferenceData {
  public id?: any;
}

