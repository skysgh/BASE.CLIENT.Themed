import { HasTenantedTitleAndDescriptionBase } from "./base/HasTenantedTitleAndDescriptionBase";
import { IHasUUID } from "./contracts/IHasUUID"

export class Statement extends HasTenantedTitleAndDescriptionBase implements IHasUUID {

  public id: any;
  public statementTypeFK: any;
  public languageCode?: string;
  public issuedUtc?: Date;
}

