import { IHasUUID } from "../../shared/models/contracts/IHasUUID"
import { HasTitleAndDescriptionBase } from "../../shared/models/base/HasTitleAndDescriptionBase";

export class Statement extends HasTitleAndDescriptionBase implements IHasUUID {

  public id: any;
  public statementTypeFK: any;
  public languageCode?: string;
  public issuedUtc?: Date;
}

