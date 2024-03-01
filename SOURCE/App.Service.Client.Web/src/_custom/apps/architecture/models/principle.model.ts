// Contracts:
import { IHasUUID } from "../../../common/contracts/IHasUUID";
import { IHasTitleAndDescription } from "../../../common/contracts/IHasTitleAndDescription";
// Related entities:
import { PrincipleType } from "./principle-type.model";

export class Principle implements IHasUUID, IHasTitleAndDescription {
  public id?: string;

  public principleType?: PrincipleType;

  public title?: string;

  public description?: string;
}
