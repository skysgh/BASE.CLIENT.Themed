import { HasTitleAndDescriptionBase } from "../../base/HasTitleAndDescriptionBase";

export abstract class SummaryItemBase extends HasTitleAndDescriptionBase{

  public iconId: string = '';
  public values: { key: string, value: any }[] = [];

}
