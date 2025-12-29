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
  
  // Extended properties for Universal Search
  /** Icon class (e.g., 'bx-bulb') */
  public icon?: string;
  /** Color for icon background */
  public color?: string;
  /** Status badge */
  public status?: { label: string; color: string };
  /** Tags */
  public tags?: string[];
  /** Route to navigate to */
  public route?: string;
  /** Subtitle */
  public subtitle?: string;
  /** Relevance score */
  public score?: number;
  /** Created date */
  public createdAt?: Date;
  /** Modified date */
  public modifiedAt?: Date;
}
