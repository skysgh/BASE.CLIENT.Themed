import { IHasUUID } from "./IHasUUID";
import { IHasTitleAndDescription } from "./IHasTitleAndDescription";

export interface IHasSummarItem extends IHasUUID, IHasTitleAndDescription {
  typeId: string;
  typeImage: string;
  type: string;
  category: string;

  values: {
    "primary": any
    "secondary": any
  }
  actions: {
  }
}
