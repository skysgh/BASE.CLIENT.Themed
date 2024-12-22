import { HasTenantedEnabledTitleAndDescriptionBase } from "./base/HasTenantedEnabledTitleAndDescriptionBase";
import { IHasUUID } from "./contracts/IHasUUID"

export class Statement extends HasTenantedEnabledTitleAndDescriptionBase implements IHasUUID {

  public id: any;
  public statementTypeFK: any;
  public languageCode?: string;
  public issuedUtc?: Date;
}

