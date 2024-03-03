import { IHasParentFK } from "../../../common/contracts/IHasParentFK";
import { ReferenceData } from "../../../common/models/reference-item.model";

export class SubSpike extends ReferenceData implements IHasParentFK {
    ParentFK?: string;
}
