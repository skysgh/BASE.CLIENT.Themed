import { IHasParentFK } from "../../../core/models/contracts/IHasParentFK";
import { IHasTitleAndDescription } from "../../../core/models/contracts/IHasTitleAndDescription";
import { IHasUUID } from "../../../core/models/contracts/IHasUUID";
import { ReferenceDataBase } from "../../../core/models/data/base/ReferenceDataBase";

export class SubSpike extends ReferenceDataBase
  implements IHasUUID, IHasTitleAndDescription, IHasParentFK {
    ParentFK?: string;
}
