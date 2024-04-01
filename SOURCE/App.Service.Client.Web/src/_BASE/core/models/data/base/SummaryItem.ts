import { HasTenantedEnabledTitleAndDescriptionBase } from "../../base/HasTenantedEnabledTitleAndDescriptionBase";

export abstract class SummaryItemBase extends HasTenantedEnabledTitleAndDescriptionBase{

  public iconId: string = '';
  public values: { key: string, value: any }[] = [];

}
