// Contracts:
import { IHasUUID } from "../../../shared/models/contracts/IHasUUID";
import { IHasTitleAndDescription } from "../../../shared/models/contracts/IHasTitleAndDescription";
// Related entities:
import { PrincipleType } from "./principle-type.model";
import { HasTitleAndDescriptionBase } from "../../../shared/models/base/HasTitleAndDescriptionBase";

export class Principle extends HasTitleAndDescriptionBase implements IHasUUID, IHasTitleAndDescription {
  public id?: string;

  public principleType?: PrincipleType;

}
