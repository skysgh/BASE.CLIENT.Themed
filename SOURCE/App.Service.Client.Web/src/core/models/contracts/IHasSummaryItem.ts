import { IHasUUID } from "./IHasUUID";
import { IHasTitleAndDescription } from "./IHasTitleAndDescription";

export interface IHasSummaryItem extends IHasUUID, IHasTitleAndDescription {
  typeId: string;
  typeImage: string;
  type: string;
  category: string;

  values?: { title: string, value: any }[];

  operations?: { title: string, action: string }[];

}
