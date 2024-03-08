import { IHasParentFK } from "../../../shared/models/contracts/IHasParentFK";
import { IHasTitleAndDescription } from "../../../shared/models/contracts/IHasTitleAndDescription";
import { IHasUUID } from "../../../shared/models/contracts/IHasUUID";
import { ReferenceDataBase } from "../../../shared/models/data/base/ReferenceDataBase";

export class SubSpike extends ReferenceDataBase
  implements IHasUUID, IHasTitleAndDescription, IHasParentFK {
    ParentFK?: string;
}
