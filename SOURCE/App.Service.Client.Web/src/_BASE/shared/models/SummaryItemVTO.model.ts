import { IHasSummarItem } from "./contracts/IHasSummaryItem";
import { ReferenceDataBase } from "./data/base/ReferenceDataBase";


export class SummaryItemVTO extends ReferenceDataBase implements IHasSummarItem {
  typeId: string = '';
  typeImage: string = '';

  public values?: { title: string, value: any }[];
  // Array of string|string:
  public operations?: { title: string, action: string }[];



  public type: string = '';
  public category: string = '';
  public more: string = '';

}
