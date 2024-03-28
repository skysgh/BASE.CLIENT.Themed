import { HasTitleAndDescriptionBase } from "./base/HasTitleAndDescriptionBase";
import { IHasUUID } from "./contracts/IHasUUID"

export class Statement extends HasTitleAndDescriptionBase implements IHasUUID {

  public id: any;
  public statementTypeFK: any;
  public languageCode?: string;
  public issuedUtc?: Date;
}

