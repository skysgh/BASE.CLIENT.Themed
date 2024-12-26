import { HasUntenantedEnabledTitleAndDescriptionBase } from "./base/HasUntenantedEnabledTitleAndDescriptionBase";
import { IHasSummaryItem } from "./contracts/IHasSummaryItem";


export class SummaryItemVTO extends HasUntenantedEnabledTitleAndDescriptionBase
  implements IHasSummaryItem {

  typeId: string = '';
  typeImage: string = '';

  public values?: { title: string, value: any }[];
  // Array of string|string:
  public operations?: { title: string, action: string }[];



  public type: string = '';
  public category: string = '';
  public more: string = '';

}
