import { ReferenceDataBase } from "./data/base/ReferenceDataBase";


// A Generic item in a REference Data list
// suitable for dropdowns.
// Note that Service should return list in the
// order desired displayed (ie ,that MRU items)


export class Agreement extends ReferenceDataBase {
  public EncodingTypeFK: any;
  public EncodedText?: string;
}

