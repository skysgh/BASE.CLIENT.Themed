// Contracts:
import { IHasUUID } from "../../../core/models/contracts/IHasUUID";
import { IHasTitleAndDescription } from "../../../core/models/contracts/IHasTitleAndDescription";
// Related entities:
import { PrincipleType } from "./principle-type.model";
import { HasTenantedEnabledTitleAndDescriptionBase } from "../../../core/models/base/HasTenantedEnabledTitleAndDescriptionBase";

export class Principle extends HasTenantedEnabledTitleAndDescriptionBase
  implements IHasUUID, IHasTitleAndDescription {

  public principleType?: PrincipleType;

}
