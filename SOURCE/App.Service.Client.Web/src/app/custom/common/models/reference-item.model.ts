import { IHasReferenceData } from  "../contracts/IHasReferenceData";

// A Generic item in a REference Data list
// suitable for dropdowns.
// Note that Service should return list in the
// order desired displayed (ie ,that MRU items)
// were put at top, before padding with remainder.
export class ReferenceData implements IHasReferenceData {
  public id?: any;
  public title?: string;
  public description?: string;
}
