import { IHasParentFK } from "../../../shared/models/contracts/IHasParentFK";
import { ReferenceDataBase } from "../../../shared/models/base/ReferenceDataBase";

export class SubSpike extends ReferenceDataBase implements IHasParentFK {
    ParentFK?: string;
}
