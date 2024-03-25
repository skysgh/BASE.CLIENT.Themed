// Contracts:
import { IHasUUID } from "../../../core/models/contracts/IHasUUID";
import { IHasTitleAndDescription } from "../../../core/models/contracts/IHasTitleAndDescription";
// Related entities:
import { PrincipleType } from "./principle-type.model";
import { HasTitleAndDescriptionBase } from "../../../core/models/base/HasTitleAndDescriptionBase";

export class Principle extends HasTitleAndDescriptionBase implements IHasUUID, IHasTitleAndDescription {
  public id?: string;

  public principleType?: PrincipleType;

}
