import { HasTenantedReferenceDataBase } from "../../../core/models/base/HasTenantedReferenceDataBase";
import { IHasParentFK } from "../../../core/models/contracts/IHasParentFK";
import { IHasTitleAndDescription } from "../../../core/models/contracts/IHasTitleAndDescription";
import { IHasUUID } from "../../../core/models/contracts/IHasUUID";

export class SubSpike extends HasTenantedReferenceDataBase
  implements IHasParentFK,
  //TODO: Explain why it doesn't know this?
  IHasUUID, IHasTitleAndDescription
{
  ParentFK?: string;
}
