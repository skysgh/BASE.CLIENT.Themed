import { IHasSummarItem } from "./contracts/IHasSummaryItem";
import { ReferenceDataBase } from "./data/base/ReferenceDataBase";


export class SummaryItem extends ReferenceDataBase implements IHasSummarItem {
  typeId: string = '';
  typeImage: string = '';

  public values =
    {
      primary: '',
      secondary: ''
    };
  public actions = {};


  public type: string = '';
  public category: string = '';
  public more: string = '';

}
