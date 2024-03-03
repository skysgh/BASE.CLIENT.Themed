import { IHasUUID } from "./contracts/IHasUUID";
import { IHasTitleAndDescription } from "./contracts/IHasTitleAndDescription";

export class SearchSummaryItem implements IHasUUID, IHasTitleAndDescription {
  public id?: any;

  public typeImageUrl?: string;

  public title?: string;
  public description?: string;

  public value1?: any;
  public value2?: any;

}
